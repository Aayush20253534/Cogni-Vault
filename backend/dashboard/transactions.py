import logging
from typing import Sequence

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.crud.transaction import get_recent_transactions, get_transaction_by_id
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.transaction_service import process_transaction
import uuid

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a UPI transaction for processing",
    response_description="Fully processed transaction with fraud classification",
)
async def submit_transaction(
    payload: TransactionCreate,
    db: AsyncSession = Depends(get_db),
) -> TransactionResponse:
    try:
        return await process_transaction(db=db, payload=payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    except RuntimeError as exc:
        logger.error("Transaction pipeline RuntimeError: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Transaction processing failed — internal pipeline error.",
        )
    except Exception as exc:
        logger.error("Unexpected error in submit_transaction: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again.",
        )


@router.get(
    "/",
    response_model=list[TransactionResponse],
    summary="Fetch recent transactions (paginated)",
)
async def list_transactions(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> Sequence[TransactionResponse]:
    transactions = await get_recent_transactions(db=db, limit=limit, offset=offset)
    return [TransactionResponse.model_validate(t) for t in transactions]


@router.get(
    "/{transaction_id}",
    response_model=TransactionResponse,
    summary="Fetch a single transaction by UUID",
)
async def get_transaction(
    transaction_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> TransactionResponse:
    transaction = await get_transaction_by_id(db=db, transaction_id=transaction_id)
    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction {transaction_id} not found.",
        )
    return TransactionResponse.model_validate(transaction)
