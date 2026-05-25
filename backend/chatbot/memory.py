"""
chatbot/memory.py

Per-user, per-session chat history management.

History is stored in-process (a plain dict) for simplicity. To scale
horizontally, swap ``_store`` for a Redis-backed implementation without
changing any other file — the interface stays the same.

Public API
----------
save_message(user_id, session_id, role, content)
get_history(user_id, session_id) -> list[MessageRecord]
get_langchain_history(user_id, session_id) -> list[BaseMessage]
clear_history(user_id, session_id)
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Literal

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage

from chatbot.schemas import MessageRecord

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# In-memory store
# key: (user_id, session_id)  →  value: list[MessageRecord]
# ---------------------------------------------------------------------------

_store: dict[tuple[str, str], list[MessageRecord]] = {}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _key(user_id: str, session_id: str) -> tuple[str, str]:
    """Return the compound store key for a user / session pair."""
    return (user_id, session_id)


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------


def save_message(
    user_id: str,
    session_id: str,
    role: Literal["user", "assistant"],
    content: str,
) -> None:
    """
    Append a single message to the user's session history.

    Parameters
    ----------
    user_id:
        Unique identifier for the authenticated user (extracted from JWT).
    session_id:
        Conversation session identifier.
    role:
        ``"user"`` or ``"assistant"``.
    content:
        Text content of the message.
    """
    key = _key(user_id, session_id)
    record = MessageRecord(role=role, content=content, timestamp=datetime.utcnow())

    if key not in _store:
        _store[key] = []

    _store[key].append(record)
    logger.debug(
        "[Memory] Saved %s message for user=%s session=%s (total=%d).",
        role,
        user_id,
        session_id,
        len(_store[key]),
    )


def get_history(user_id: str, session_id: str) -> list[MessageRecord]:
    """
    Return the full message history for a user / session pair.

    Parameters
    ----------
    user_id:
        Unique user identifier.
    session_id:
        Conversation session identifier.

    Returns
    -------
    list[MessageRecord]
        Ordered list of message records (oldest first).
        Returns an empty list if no history exists.
    """
    key = _key(user_id, session_id)
    history = _store.get(key, [])
    logger.debug(
        "[Memory] Retrieved %d messages for user=%s session=%s.",
        len(history),
        user_id,
        session_id,
    )
    return list(history)  # Return a copy to prevent external mutation


def get_langchain_history(user_id: str, session_id: str) -> list[BaseMessage]:
    """
    Return chat history as LangChain ``BaseMessage`` objects, ready for
    injection into a ``ChatPromptTemplate``.

    Parameters
    ----------
    user_id:
        Unique user identifier.
    session_id:
        Conversation session identifier.

    Returns
    -------
    list[BaseMessage]
        Alternating ``HumanMessage`` / ``AIMessage`` objects.
    """
    records = get_history(user_id, session_id)
    messages: list[BaseMessage] = []

    for record in records:
        if record.role == "user":
            messages.append(HumanMessage(content=record.content))
        else:
            messages.append(AIMessage(content=record.content))

    return messages


def clear_history(user_id: str, session_id: str) -> None:
    """
    Delete all messages for a user / session pair.

    Parameters
    ----------
    user_id:
        Unique user identifier.
    session_id:
        Conversation session identifier.
    """
    key = _key(user_id, session_id)
    removed = _store.pop(key, None)
    count = len(removed) if removed else 0
    logger.info(
        "[Memory] Cleared %d messages for user=%s session=%s.",
        count,
        user_id,
        session_id,
    )