"""
main.py - FastAPI application entry point for COGNI VAULT Backend API.

Wires together:
  - SQLAlchemy table creation on startup
  - CORS middleware
  - Auth router  (auth.router)
  - Chatbot router (chatbot.routes → re-exported via chatbot.router)
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.database import engine
from auth.models import Base
from auth.router import router as auth_router
from chatbot.router import router as chatbot_router   


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="COGNI VAULT Backend API",
    description="LangChain + Groq chatbot with RAG, JWT auth, and per-user memory.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(chatbot_router, prefix="/chat", tags=["Chatbot"])

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health() -> dict:
    return {"status": "ok"}