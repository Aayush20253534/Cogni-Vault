"""
chatbot/schemas.py

Pydantic request/response models for the chatbot API.
All models use strict typing and include field-level documentation.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------


class ChatRequest(BaseModel):
    """
    Payload sent by the client for a single chat turn.

    Attributes
    ----------
    message:
        The user's input text.
    session_id:
        Optional session identifier allowing multiple independent
        conversations per user. Defaults to ``"default"``.
    """

    message: str = Field(
        ...,
        min_length=1,
        max_length=4096,
        description="The user's input message.",
        examples=["What is the return policy?"],
    )
    session_id: str = Field(
        default="default",
        max_length=128,
        description="Conversation session identifier.",
    )


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------


class ChatResponse(BaseModel):
    """
    Response returned after a non-streaming chat completion.

    Attributes
    ----------
    answer:
        The assistant's reply text.
    session_id:
        Echoes back the session_id from the request.
    """

    answer: str = Field(..., description="The assistant's reply.")
    session_id: str = Field(..., description="Session identifier.")


class MessageRecord(BaseModel):
    """
    A single message stored in chat history.

    Attributes
    ----------
    role:
        Either ``"user"`` or ``"assistant"``.
    content:
        The message text.
    timestamp:
        UTC timestamp of when the message was recorded.
    """

    role: Literal["user", "assistant"] = Field(
        ..., description="Speaker role."
    )
    content: str = Field(..., description="Message text.")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="UTC timestamp of the message.",
    )


class HistoryResponse(BaseModel):
    """
    Full chat history for a user session.

    Attributes
    ----------
    session_id:
        The session whose history is returned.
    messages:
        Ordered list of messages (oldest first).
    """

    session_id: str = Field(..., description="Session identifier.")
    messages: list[MessageRecord] = Field(
        default_factory=list,
        description="Ordered conversation history.",
    )


class ClearHistoryResponse(BaseModel):
    """
    Confirmation payload returned when history is cleared.

    Attributes
    ----------
    detail:
        Human-readable confirmation message.
    session_id:
        The session whose history was cleared.
    """

    detail: str = Field(..., description="Confirmation message.")
    session_id: str = Field(..., description="Session identifier.")