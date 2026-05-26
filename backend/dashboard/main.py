import logging
import logging.config
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.websocket import router as ws_router
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import Base, engine

# ─── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)-30s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Cogni-Vault starting up | env=%s", settings.APP_ENV)

    # Ensure all mapped tables exist (idempotent)
    async with engine.begin() as conn:
        # Import all models so Base.metadata is populated before create_all
        from app.models import transaction as _  # noqa: F401
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database tables verified / created successfully.")
    yield

    logger.info("Cogni-Vault shutting down — disposing engine pool.")
    await engine.dispose()
    logger.info("Shutdown complete.")


# ─── Application ──────────────────────────────────────────────────────────────

app = FastAPI(
    title="Cogni-Vault UPI Fraud Detection API",
    version="1.0.0",
    description=(
        "Production-grade asynchronous UPI transaction processing service with "
        "real-time ML fraud detection and WebSocket dashboard streaming."
    ),
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ─── Middleware ────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Restrict to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

# HTTP REST  →  /api/v1/transactions/
app.include_router(api_router, prefix="/api/v1")

# WebSocket  →  /ws/dashboard
app.include_router(ws_router, prefix="/ws")


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["health"], summary="Service liveness probe")
async def health_check() -> dict:
    return {
        "status": "healthy",
        "service": "cogni-vault-backend",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
    }
