from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from auth.models import  User  
from auth.dependencies import get_current_active_user

from chatbot.chat import chat, chat_stream
from chatbot.session_manager import create_session, get_session, get_user_sessions

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


# ──────────────────────────────────────────────
# Request / Response Schemas
# ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    query: str
    session_id: str | None = None  # if None, a new session is created automatically


class ChatResponse(BaseModel):
    session_id: str
    response: str


# ──────────────────────────────────────────────
# Helper
# ──────────────────────────────────────────────

def _resolve_session(user_id: str, session_id: str | None) -> str:
    """
    Returns the session_id to use.
    - If session_id is provided, validates it belongs to the user.
    - If not provided, creates a fresh session.
    """
    if session_id:
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Session does not belong to this user.")
        return session_id
    return create_session(user_id)


# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse, summary="Standard (blocking) chat")
def chat_endpoint(
    body: ChatRequest,
    current_user: User = Depends(get_current_active_user),
):
    """
    Send a message and receive the complete response in one go.

    - **query**: The user's message.
    - **session_id**: *(optional)* Resume an existing session.
      If omitted, a new session is created and its ID is returned.
    """
    user_id = str(current_user.id)
    session_id = _resolve_session(user_id, body.session_id)

    response_text = chat(
        query=body.query,
        user_id=user_id,
        session_id=session_id,
    )

    return ChatResponse(session_id=session_id, response=response_text)


@router.post("/chat/stream", summary="Streaming chat (Server-Sent Events)")
def chat_stream_endpoint(
    body: ChatRequest,
    current_user: User = Depends(get_current_active_user),
):
    """
    Send a message and receive the response as a stream of text chunks
    using **Server-Sent Events** (`text/event-stream`).

    Each SSE event looks like:
    ```
    data: <chunk_text>\\n\\n
    ```
    The stream ends with:
    ```
    data: [DONE]\\n\\n
    ```

    - **query**: The user's message.
    - **session_id**: *(optional)* Resume an existing session.
      If omitted, a new session is created; the session ID is sent as the
      very first SSE event in the format `session:<session_id>`.
    """
    user_id = str(current_user.id)
    session_id = _resolve_session(user_id, body.session_id)

    def event_generator():
        # Send session ID first so the client can track the conversation
        yield f"session:{session_id}\n\n"

        for chunk in chat_stream(
            query=body.query,
            user_id=user_id,
            session_id=session_id,
        ):
            if chunk:  # skip empty strings that some LLMs emit
                yield f"data: {chunk}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disables Nginx buffering
        },
    )


# ──────────────────────────────────────────────
# Convenience: session management endpoints
# ──────────────────────────────────────────────

@router.post("/sessions", summary="Create a new session")
def new_session(current_user: User = Depends(get_current_active_user)):
    """Creates a fresh session for the authenticated user."""
    session_id = create_session(str(current_user.id))
    return {"session_id": session_id}


@router.get("/sessions", summary="List all sessions for the current user")
def list_sessions(current_user: User = Depends(get_current_active_user)):
    """Returns all sessions belonging to the authenticated user."""
    sessions = get_user_sessions(str(current_user.id))
    return {"sessions": sessions}