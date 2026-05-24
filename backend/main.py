from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from auth.database import engine
from auth.models import Base
from auth.router import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Create all tables on startup (use Alembic for production migrations)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="COGNI VAULT Backend API",
    description="",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health() -> dict:
    return {"status": "ok"}