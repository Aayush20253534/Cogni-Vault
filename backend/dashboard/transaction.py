import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum as SAEnum, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TransactionStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"


class FraudStatus(str, enum.Enum):
    CLEAN = "CLEAN"
    SUSPICIOUS = "SUSPICIOUS"
    FLAGGED = "FLAGGED"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True,
    )
    sender_upi: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    receiver_upi: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    amount: Mapped[float] = mapped_column(
        Numeric(precision=18, scale=2),
        nullable=False,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )
    status: Mapped[TransactionStatus] = mapped_column(
        SAEnum(
            TransactionStatus,
            name="transaction_status_enum",
            create_type=True,
        ),
        nullable=False,
        default=TransactionStatus.PENDING,
    )
    fraud_status: Mapped[FraudStatus] = mapped_column(
        SAEnum(
            FraudStatus,
            name="fraud_status_enum",
            create_type=True,
        ),
        nullable=False,
        default=FraudStatus.CLEAN,
    )

    def __repr__(self) -> str:
        return (
            f"<Transaction id={self.id} amount={self.amount} "
            f"status={self.status} fraud={self.fraud_status}>"
        )
