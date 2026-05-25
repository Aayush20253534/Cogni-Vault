"""
chatbot/service.py

Chatbot service layer — the single source of truth for business logic.

Responsibilities
----------------
1. Accept a user message and session context.
2. Retrieve relevant knowledge via RAG.
3. Load per-user conversation history.
4. Build the full prompt for the LLM.
5. Call the LLM (regular or streaming).
6. Persist the exchange to memory.
7. Return the assistant's reply.

All functions in this module are async to avoid blocking the event loop.
"""

from __future__ import annotations

import logging
import os
from functools import lru_cache
from typing import AsyncGenerator

from langchain_core.messages import BaseMessage

from chatbot import memory as mem
from chatbot.llm import chat, chat_stream
from chatbot.prompts import build_chat_prompt, format_retrieved_context
from chatbot.schemas import ChatResponse, HistoryResponse, MessageRecord 

from RAG.rag import KnowledgeRAG  # type: ignore[import]

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# RAG singleton
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def _get_rag() -> KnowledgeRAG:
    """
    Return a singleton KnowledgeRAG instance.

    The knowledge directory is read from the ``KNOWLEDGE_DIR`` environment
    variable (defaults to ``./knowledge``).
    """
    knowledge_dir = os.getenv("KNOWLEDGE_DIR", "./knowledge")
    logger.info("[Service] Initialising KnowledgeRAG from '%s'.", knowledge_dir)
    return KnowledgeRAG(knowledge_dir=knowledge_dir)


# ---------------------------------------------------------------------------
# Prompt builder helper
# ---------------------------------------------------------------------------


def _build_messages(
    context_str: str,
    history: list[BaseMessage],
    user_message: str,
) -> list[BaseMessage]:
    """
    Render the chat prompt template into a list of LangChain ``BaseMessage``
    objects ready to send to the LLM.

    Parameters
    ----------
    context_str:
        Formatted RAG context string (may be empty).
    history:
        LangChain message objects from memory.
    user_message:
        The current user input.

    Returns
    -------
    list[BaseMessage]
    """
    prompt = build_chat_prompt()
    rendered = prompt.format_messages(
        context=context_str if context_str else "No additional context available.",
        history=history,
        user_message=user_message,
    )
    return rendered


# ---------------------------------------------------------------------------
# Public service functions
# ---------------------------------------------------------------------------


async def handle_chat(
    user_id: str,
    session_id: str,
    user_message: str,
) -> ChatResponse:
    """
    Process a single chat turn and return the assistant's full reply.

    Parameters
    ----------
    user_id:
        Authenticated user's unique identifier (from JWT).
    session_id:
        Conversation session identifier.
    user_message:
        The user's input text.

    Returns
    -------
    ChatResponse
        Contains the assistant's answer and the echoed session_id.
    """
    logger.info(
        "[Service] handle_chat | user=%s session=%s | message_len=%d",
        user_id,
        session_id,
        len(user_message),
    )

    # 1. Retrieve relevant knowledge
    try:
        rag = _get_rag()
        chunks = rag.retrieve(user_message, top_k=5)
        context_str = format_retrieved_context(chunks)
        logger.debug("[Service] RAG returned %d chunks.", len(chunks))
    except Exception:
        logger.exception("[Service] RAG retrieval failed; continuing without context.")
        context_str = ""

    # 2. Load conversation history
    history: list[BaseMessage] = mem.get_langchain_history(user_id, session_id)

    # 3. Build the full prompt
    messages = _build_messages(context_str, history, user_message)

    # 4. Call the LLM
    answer = await chat(messages)

    # 5. Persist both turns to memory
    mem.save_message(user_id, session_id, "user", user_message)
    mem.save_message(user_id, session_id, "assistant", answer)

    logger.info(
        "[Service] handle_chat complete | user=%s session=%s | answer_len=%d",
        user_id,
        session_id,
        len(answer),
    )

    return ChatResponse(answer=answer, session_id=session_id)


async def handle_chat_stream(
    user_id: str,
    session_id: str,
    user_message: str,
) -> AsyncGenerator[str, None]:
    """
    Process a single chat turn and yield the assistant's reply as a stream
    of text chunks (Server-Sent Events compatible).

    Conversation history is persisted once the full response is assembled.

    Parameters
    ----------
    user_id:
        Authenticated user's unique identifier (from JWT).
    session_id:
        Conversation session identifier.
    user_message:
        The user's input text.

    Yields
    ------
    str
        Incremental text chunks from the LLM.
    """
    logger.info(
        "[Service] handle_chat_stream | user=%s session=%s | message_len=%d",
        user_id,
        session_id,
        len(user_message),
    )

    # 1. Retrieve relevant knowledge
    try:
        rag = _get_rag()
        chunks = rag.retrieve(user_message, top_k=5)
        context_str = format_retrieved_context(chunks)
    except Exception:
        logger.exception("[Service] RAG retrieval failed; continuing without context.")
        context_str = ""

    # 2. Load conversation history
    history: list[BaseMessage] = mem.get_langchain_history(user_id, session_id)

    # 3. Build the full prompt
    messages = _build_messages(context_str, history, user_message)

    # 4. Stream from the LLM and collect the full answer for memory
    collected_chunks: list[str] = []

    async for chunk in chat_stream(messages):
        collected_chunks.append(chunk)
        yield chunk

    full_answer = "".join(collected_chunks)

    # 5. Persist both turns to memory
    mem.save_message(user_id, session_id, "user", user_message)
    mem.save_message(user_id, session_id, "assistant", full_answer)

    logger.info(
        "[Service] handle_chat_stream complete | user=%s session=%s | answer_len=%d",
        user_id,
        session_id,
        len(full_answer),
    )


async def get_chat_history(user_id: str, session_id: str) -> HistoryResponse:
    """
    Retrieve the full conversation history for a user session.

    Parameters
    ----------
    user_id:
        Authenticated user's unique identifier.
    session_id:
        Conversation session identifier.

    Returns
    -------
    HistoryResponse
    """
    records: list[MessageRecord] = mem.get_history(user_id, session_id)
    return HistoryResponse(session_id=session_id, messages=records)


async def delete_chat_history(user_id: str, session_id: str) -> None:
    """
    Clear the conversation history for a user session.

    Parameters
    ----------
    user_id:
        Authenticated user's unique identifier.
    session_id:
        Conversation session identifier.
    """
    mem.clear_history(user_id, session_id)