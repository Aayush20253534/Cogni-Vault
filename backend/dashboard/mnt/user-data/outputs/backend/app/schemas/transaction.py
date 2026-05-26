import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.models.transaction import FraudStatus, TransactionStatus


# ─── Inbound ──────────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    user_id: uuid.UUID
    sender_upi: str = Field(
        ...,
        min_length=3,
        max_length=100,
        pattern=r"^[\w.\-]+@[\w]+$",
        examples=["alice@oksbi"],
    )
    receiver_upi: str = Field(
        ...,
        min_length=3,
        max_length=100,
        pattern=r"^[\w.\-]+@[\w]+$",
        examples=["merchant.store@ybl"],
    )
    amount: Decimal = Field(
        ...,
        gt=Decimal("0"),
        le=Decimal("1000000"),
        examples=[499.99],
    )

    @field_validator("amount", mode="before")
    @classmethod
    def coerce_and_quantize_amount(cls, v: Any) -> Decimal:
        return Decimal(str(v)).quantize(Decimal("0.01"))


# ─── ML Analysis ──────────────────────────────────────────────────────────────

class MLAnalysisResult(BaseModel):
    risk_score: float = Field(..., ge=0.0, le=1.0)
    fraud_status: FraudStatus
    analysis_details: dict[str, Any]


# ─── Outbound ─────────────────────────────────────────────────────────────────

class TransactionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    sender_upi: str
    receiver_upi: str
    amount: Decimal
    timestamp: datetime
    status: TransactionStatus
    fraud_status: FraudStatus

    model_config = {"from_attributes": True}


# ─── WebSocket Envelope ───────────────────────────────────────────────────────

class WebSocketTransactionPayload(BaseModel):
    event: str = "transaction_update"
    data: TransactionResponse

    model_config = {"from_attributes": True}


# ─── WebSocket Ingestion (dashboard → server) ─────────────────────────────────

class WebSocketIngestPayload(BaseModel):
    user_id: uuid.UUID
    sender_upi: str = Field(
        ...,
        min_length=3,
        max_length=100,
        pattern=r"^[\w.\-]+@[\w]+$",
    )
    receiver_upi: str = Field(
        ...,
        min_length=3,
        max_length=100,
        pattern=r"^[\w.\-]+@[\w]+$",
    )
    amount: Decimal = Field(..., gt=Decimal("0"), le=Decimal("1000000"))

    @field_validator("amount", mode="before")
    @classmethod
    def coerce_and_quantize_amount(cls, v: Any) -> Decimal:
        return Decimal(str(v)).quantize(Decimal("0.01"))
