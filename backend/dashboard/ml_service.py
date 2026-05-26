import asyncio
import random
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from app.models.transaction import FraudStatus
from app.schemas.transaction import MLAnalysisResult

# ─── Thresholds ───────────────────────────────────────────────────────────────

_FLAGGED_AMOUNT_THRESHOLD: Decimal = Decimal("50000")
_SUSPICIOUS_AMOUNT_THRESHOLD: Decimal = Decimal("10000")
_MODERATE_AMOUNT_THRESHOLD: Decimal = Decimal("1000")

_HIGH_RISK_UPI_SUFFIXES: frozenset[str] = frozenset(
    ["@upi", "@fbl", "@suspicious"]
)
_KNOWN_FRAUD_UPI_PATTERNS: frozenset[str] = frozenset(
    ["fraud@ybl", "scam@paytm", "fake@oksbi", "launder@icici"]
)

# ─── Public API ───────────────────────────────────────────────────────────────

async def analyze_transaction_habits(
    transaction_id: uuid.UUID,
    sender_upi: str,
    receiver_upi: str,
    amount: Decimal,
    user_id: uuid.UUID,
) -> MLAnalysisResult:
    """
    Simulate a multi-stage ML inference pipeline:
      1. Feature extraction
      2. Model scoring (async latency simulation)
      3. Post-processing / thresholding
    """
    # Simulate realistic ML pipeline latency (feature extraction → inference)
    await asyncio.sleep(random.uniform(0.25, 0.75))

    upi_risk: float = _compute_upi_risk(sender_upi, receiver_upi)
    amount_risk: float = _compute_amount_risk(amount)
    velocity_risk: float = round(random.betavariate(2, 7), 4)
    time_of_day_risk: float = _compute_time_of_day_risk()

    # Weighted composite risk score
    risk_score: float = min(
        (upi_risk * 0.35)
        + (amount_risk * 0.40)
        + (velocity_risk * 0.15)
        + (time_of_day_risk * 0.10),
        1.0,
    )
    risk_score = round(risk_score, 4)

    fraud_status: FraudStatus = _classify_fraud_status(
        risk_score=risk_score, amount=amount
    )

    analysis_details: dict = {
        "transaction_id": str(transaction_id),
        "user_id": str(user_id),
        "evaluated_at": datetime.now(timezone.utc).isoformat(),
        "composite_risk_score": risk_score,
        "feature_weights": {
            "upi_pattern_risk": round(upi_risk, 4),
            "amount_risk": round(amount_risk, 4),
            "velocity_risk": velocity_risk,
            "time_of_day_risk": round(time_of_day_risk, 4),
        },
        "model_version": "cogni-fraud-v2.1.0",
        "inference_engine": "async-gradient-boost-sim",
    }

    return MLAnalysisResult(
        risk_score=risk_score,
        fraud_status=fraud_status,
        analysis_details=analysis_details,
    )


# ─── Private helpers ──────────────────────────────────────────────────────────

def _compute_upi_risk(sender_upi: str, receiver_upi: str) -> float:
    sender_lower = sender_upi.lower()
    receiver_lower = receiver_upi.lower()

    if (
        sender_lower in _KNOWN_FRAUD_UPI_PATTERNS
        or receiver_lower in _KNOWN_FRAUD_UPI_PATTERNS
    ):
        return random.uniform(0.80, 1.0)

    if any(
        sender_lower.endswith(suf) or receiver_lower.endswith(suf)
        for suf in _HIGH_RISK_UPI_SUFFIXES
    ):
        return random.uniform(0.50, 0.79)

    return random.uniform(0.0, 0.25)


def _compute_amount_risk(amount: Decimal) -> float:
    if amount >= _FLAGGED_AMOUNT_THRESHOLD:
        return random.uniform(0.80, 1.0)
    if amount >= _SUSPICIOUS_AMOUNT_THRESHOLD:
        return random.uniform(0.45, 0.79)
    if amount >= _MODERATE_AMOUNT_THRESHOLD:
        return random.uniform(0.10, 0.44)
    return random.uniform(0.0, 0.09)


def _compute_time_of_day_risk() -> float:
    """Transactions at odd hours carry slightly elevated risk."""
    hour: int = datetime.now(timezone.utc).hour
    # 00:00–05:00 UTC → elevated
    if 0 <= hour <= 5:
        return random.uniform(0.40, 0.80)
    return random.uniform(0.0, 0.20)


def _classify_fraud_status(risk_score: float, amount: Decimal) -> FraudStatus:
    if risk_score >= 0.70 or amount >= _FLAGGED_AMOUNT_THRESHOLD:
        return FraudStatus.FLAGGED
    if risk_score >= 0.40 or amount >= _SUSPICIOUS_AMOUNT_THRESHOLD:
        return FraudStatus.SUSPICIOUS
    return FraudStatus.CLEAN
