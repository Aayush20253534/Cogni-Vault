"""
chatbot/routes.py

FastAPI router for all chatbot endpoints.

Endpoints
---------
POST   /chat          – Single-turn chat (full response).
POST   /chat/stream   – Single-turn chat (SSE streaming response).
GET    /chat/history  – Retrieve conversation history.
DELETE /chat/history  – Clear conversation history.

All endpoints require a valid JWT (enforced via ``get_current_user``).
"""

from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse

from auth.dependencies import get_current_user  # type: ignore[import]
from chatbot import service
from chatbot.schemas import (
    ChatRequest,
    ChatResponse,
    ClearHistoryResponse,
    HistoryResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Type alias for the injected current-user dependency
CurrentUser = Annotated[dict, Depends(get_current_user)]


# ---------------------------------------------------------------------------
# Helper: extract user identity from the JWT payload
# ---------------------------------------------------------------------------


def _user_id(current_user) -> str:
    """
    Extract a stable string identifier from the current_user object.

    Supports both SQLAlchemy model instances (attribute access) and plain
    dicts (key access). Tries common field names: id, user_id, sub, email.
    """
    for attr in ("id", "user_id", "sub", "email"):
        # Attribute access — SQLAlchemy User model instance
        val = getattr(current_user, attr, None)
        if val is not None:
            return str(val)
        # Dict access — plain JWT payload dict
        if isinstance(current_user, dict) and attr in current_user:
            return str(current_user[attr])
    return str(current_user)


# ---------------------------------------------------------------------------
# POST /chat
# ---------------------------------------------------------------------------


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a chat message and receive a full response.",
)
async def chat_endpoint(
    body: ChatRequest,
    current_user: CurrentUser,
) -> ChatResponse:
    """
    Process a user message and return the assistant's complete reply.

    - Retrieves relevant knowledge via the RAG pipeline.
    - Maintains per-user, per-session conversation history.
    - Returns the full response once generation is complete.

    **Requires:** Bearer JWT in the ``Authorization`` header.
    """
    user_id = _user_id(current_user)
    logger.info(
        "[Route] POST /chat | user=%s session=%s", user_id, body.session_id
    )

    response = await service.handle_chat(
        user_id=user_id,
        session_id=body.session_id,
        user_message=body.message,
    )
    return response


# ---------------------------------------------------------------------------
# POST /chat/stream
# ---------------------------------------------------------------------------


@router.post(
    "/stream",
    status_code=status.HTTP_200_OK,
    summary="Send a chat message and receive a streaming (SSE) response.",
    response_class=StreamingResponse,
)
async def chat_stream_endpoint(
    body: ChatRequest,
    current_user: CurrentUser,
) -> StreamingResponse:
    """
    Process a user message and stream the assistant's reply as
    Server-Sent Events (``text/event-stream``).

    Each event is a plain text chunk prefixed with ``data: ``.
    The stream terminates with ``data: [DONE]\\n\\n``.

    **Requires:** Bearer JWT in the ``Authorization`` header.
    """
    user_id = _user_id(current_user)
    logger.info(
        "[Route] POST /chat/stream | user=%s session=%s", user_id, body.session_id
    )

    async def event_generator():
        """Wrap the service stream generator in SSE format."""
        try:
            async for chunk in service.handle_chat_stream(
                user_id=user_id,
                session_id=body.session_id,
                user_message=body.message,
            ):
                # SSE format: "data: <payload>\n\n"
                yield f"data: {chunk}\n\n"
        except Exception:
            logger.exception("[Route] Streaming error for user=%s", user_id)
            yield "data: [ERROR] An error occurred during streaming.\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering for SSE
        },
    )


# ---------------------------------------------------------------------------
# GET /chat/history
# ---------------------------------------------------------------------------


@router.get(
    "/history",
    response_model=HistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve conversation history for a session.",
)
async def get_history_endpoint(
    current_user: CurrentUser,
    session_id: str = Query(default="default", max_length=128),
) -> HistoryResponse:
    """
    Return the full ordered conversation history for the authenticated
    user's specified session.

    **Requires:** Bearer JWT in the ``Authorization`` header.
    """
    user_id = _user_id(current_user)
    logger.info(
        "[Route] GET /chat/history | user=%s session=%s", user_id, session_id
    )
    return await service.get_chat_history(user_id=user_id, session_id=session_id)


# ---------------------------------------------------------------------------
# DELETE /chat/history
# ---------------------------------------------------------------------------


@router.delete(
    "/history",
    response_model=ClearHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Clear conversation history for a session.",
)
async def delete_history_endpoint(
    current_user: CurrentUser,
    session_id: str = Query(default="default", max_length=128),
) -> ClearHistoryResponse:
    """
    Permanently delete all messages for the authenticated user's specified
    session. This action is irreversible.

    **Requires:** Bearer JWT in the ``Authorization`` header.
    """
    user_id = _user_id(current_user)
    logger.info(
        "[Route] DELETE /chat/history | user=%s session=%s", user_id, session_id
    )
    await service.delete_chat_history(user_id=user_id, session_id=session_id)
    return ClearHistoryResponse(
        detail="Chat history cleared successfully.",
        session_id=session_id,
    )