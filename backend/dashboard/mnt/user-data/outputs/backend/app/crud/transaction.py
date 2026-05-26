import uuid
from datetime import datetime, timezone
from typing import Optional, Sequence

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import FraudStatus, Transaction, TransactionStatus
from app.schemas.transaction import TransactionCreate


async def create_transaction(
    db: AsyncSession,
    payload: TransactionCreate,
) -> Transaction:
    transaction = Transaction(
        id=uuid.uuid4(),
        user_id=payload.user_id,
        sender_upi=payload.sender_upi,
        receiver_upi=payload.receiver_upi,
        amount=float(payload.amount),
        timestamp=datetime.now(timezone.utc),
        status=TransactionStatus.PENDING,
        fraud_status=FraudStatus.CLEAN,
    )
    db.add(transaction)
    await db.flush()
    await db.refresh(transaction)
    return transaction


async def update_transaction_final_state(
    db: AsyncSession,
    transaction_id: uuid.UUID,
    status: TransactionStatus,
    fraud_status: FraudStatus,
) -> Optional[Transaction]:
    stmt = (
        update(Transaction)
        .where(Transaction.id == transaction_id)
        .values(status=status, fraud_status=fraud_status)
    )
    await db.execute(stmt)
    await db.flush()

    result = await db.execute(
        select(Transaction).where(Transaction.id == transaction_id)
    )
    return result.scalars().first()


async def get_transaction_by_id(
    db: AsyncSession,
    transaction_id: uuid.UUID,
) -> Optional[Transaction]:
    result = await db.execute(
        select(Transaction).where(Transaction.id == transaction_id)
    )
    return result.scalars().first()


async def get_recent_transactions(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
) -> Sequence[Transaction]:
    result = await db.execute(
        select(Transaction)
        .order_by(Transaction.timestamp.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()
