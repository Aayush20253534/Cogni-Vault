import asyncio
import logging
import random
import uuid
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.transaction import create_transaction, update_transaction_final_state
from app.core.ws_manager import manager
from app.models.transaction import FraudStatus, TransactionStatus
from app.schemas.transaction import (
    MLAnalysisResult,
    TransactionCreate,
    TransactionResponse,
    WebSocketTransactionPayload,
)
from app.services.ml_service import analyze_transaction_habits

logger = logging.getLogger(__name__)


# ─── Bank Ledger Settlement Simulation ───────────────────────────────────────

async def _simulate_bank_ledger_settlement(
    transaction_id: uuid.UUID,
    sender_upi: str,
    receiver_upi: str,
    amount: Decimal,
) -> bool:
    """
    Simulate an async bank-to-bank NEFT/IMPS ledger settlement.
    Latency scales with amount to mimic real-world large-value checks.
    Returns True on settlement success, False on failure.
    """
    base_latency: float = 0.15
    amount_latency: float = float(amount) / 600_000.0 * 0.40
    await asyncio.sleep(base_latency + amount_latency)

    # 98 % success rate; high-value transactions are slightly more scrutinised
    failure_rate: float = 0.02 if amount < Decimal("50000") else 0.06
    return random.random() > failure_rate


# ─── Core Pipeline ────────────────────────────────────────────────────────────

async def process_transaction(
    db: AsyncSession,
    payload: TransactionCreate,
) -> TransactionResponse:
    """
    Executes the full transaction lifecycle:

    Step A  – Validate & persist PENDING record.
    Step B  – Async bank ledger settlement (simulated).
    Step C  – Concurrent ML fraud analysis pipeline.
    Step D  – Update PostgreSQL row with final status + fraud classification.
    Step E  – Broadcast serialised result to all WebSocket dashboard clients.
    """

    # ── Step A ────────────────────────────────────────────────────────────────
    transaction = await create_transaction(db=db, payload=payload)
    transaction_id: uuid.UUID = transaction.id

    logger.info(
        "Transaction created | id=%s sender=%s receiver=%s amount=%s",
        transaction_id,
        payload.sender_upi,
        payload.receiver_upi,
        payload.amount,
    )

    final_status: TransactionStatus
    final_fraud_status: FraudStatus

    try:
        # ── Steps B + C (concurrent) ──────────────────────────────────────────
        settlement_task: asyncio.Task[bool] = asyncio.create_task(
            _simulate_bank_ledger_settlement(
                transaction_id=transaction_id,
                sender_upi=payload.sender_upi,
                receiver_upi=payload.receiver_upi,
                amount=payload.amount,
            )
        )
        ml_task: asyncio.Task[MLAnalysisResult] = asyncio.create_task(
            analyze_transaction_habits(
                transaction_id=transaction_id,
                sender_upi=payload.sender_upi,
                receiver_upi=payload.receiver_upi,
                amount=payload.amount,
                user_id=payload.user_id,
            )
        )

        settlement_success: bool
        ml_result: MLAnalysisResult
        settlement_success, ml_result = await asyncio.gather(
            settlement_task,
            ml_task,
            return_exceptions=False,
        )

        # ── Determine final states ────────────────────────────────────────────
        if not settlement_success:
            final_status = TransactionStatus.FAILED
            final_fraud_status = FraudStatus.CLEAN
            logger.warning(
                "Settlement failed | id=%s",
                transaction_id,
            )
        else:
            final_status = TransactionStatus.SUCCESS
            final_fraud_status = ml_result.fraud_status
            logger.info(
                "Settlement success | id=%s risk_score=%.4f fraud=%s",
                transaction_id,
                ml_result.risk_score,
                final_fraud_status,
            )

    except Exception as exc:
        logger.error(
            "Pipeline error | id=%s error=%s",
            transaction_id,
            exc,
            exc_info=True,
        )
        final_status = TransactionStatus.FAILED
        final_fraud_status = FraudStatus.CLEAN

    # ── Step D ────────────────────────────────────────────────────────────────
    updated = await update_transaction_final_state(
        db=db,
        transaction_id=transaction_id,
        status=final_status,
        fraud_status=final_fraud_status,
    )

    if updated is None:
        raise RuntimeError(
            f"update_transaction_final_state returned None for id={transaction_id}"
        )

    # ── Step E ────────────────────────────────────────────────────────────────
    response: TransactionResponse = TransactionResponse.model_validate(updated)

    ws_envelope: WebSocketTransactionPayload = WebSocketTransactionPayload(
        event="transaction_update",
        data=response,
    )

    await manager.broadcast(ws_envelope.model_dump(mode="json"))

    logger.info(
        "Broadcast complete | id=%s clients=%d",
        transaction_id,
        manager.active_connection_count,
    )

    return response
