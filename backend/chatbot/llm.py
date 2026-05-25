"""
chatbot/llm.py

Dedicated module for Groq LLM communication via LangChain.

Provides:
- ``get_llm()``          – returns a cached synchronous ChatGroq instance.
- ``chat()``             – async single-turn completion.
- ``chat_stream()``      – async streaming completion (yields text chunks).
"""

from __future__ import annotations

import logging
import os
from functools import lru_cache
from typing import AsyncGenerator

from langchain_core.messages import BaseMessage
from langchain_groq import ChatGroq

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DEFAULT_MODEL = "openai/gpt-oss-120b"
DEFAULT_TEMPERATURE = 0.3
DEFAULT_MAX_TOKENS = 1024


# ---------------------------------------------------------------------------
# LLM factory (cached so the object is reused across requests)
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def get_llm() -> ChatGroq:
    """
    Return a singleton ``ChatGroq`` instance configured from environment variables.

    Environment variables
    ---------------------
    GROQ_API_KEY     : Required. Your Groq API key.
    GROQ_MODEL       : Optional. Defaults to ``llama3-70b-8192``.
    GROQ_TEMPERATURE : Optional. Float between 0 and 1. Defaults to ``0.3``.
    GROQ_MAX_TOKENS  : Optional. Integer. Defaults to ``1024``.

    Returns
    -------
    ChatGroq
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GROQ_API_KEY is not set. "
            "Add it to your .env file or environment before starting the server."
        )

    model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)
    temperature = float(os.getenv("GROQ_TEMPERATURE", str(DEFAULT_TEMPERATURE)))
    max_tokens = int(os.getenv("GROQ_MAX_TOKENS", str(DEFAULT_MAX_TOKENS)))

    logger.info(
        "[LLM] Initialising ChatGroq | model=%s | temperature=%.2f | max_tokens=%d",
        model,
        temperature,
        max_tokens,
    )

    return ChatGroq(
        model=model,
        api_key=api_key,
        temperature=temperature,
        max_tokens=max_tokens
    )


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------


async def chat(messages: list[BaseMessage]) -> str:
    """
    Run a single async completion and return the assistant's reply as a string.

    Parameters
    ----------
    messages:
        Full list of LangChain ``BaseMessage`` objects (system, human, ai …)
        representing the conversation so far.

    Returns
    -------
    str
        The assistant's reply text.

    Raises
    ------
    RuntimeError
        If the LLM returns an unexpected response format.
    """
    llm = get_llm()

    logger.debug("[LLM] Sending %d messages to Groq (non-streaming).", len(messages))

    # LangChain's ainvoke handles async execution
    response = await llm.ainvoke(messages)

    if not hasattr(response, "content"):
        raise RuntimeError(f"Unexpected LLM response type: {type(response)}")

    return str(response.content)


async def chat_stream(messages: list[BaseMessage]) -> AsyncGenerator[str, None]:
    """
    Run a streaming async completion and yield text chunks as they arrive.

    Parameters
    ----------
    messages:
        Full list of LangChain ``BaseMessage`` objects.

    Yields
    ------
    str
        Incremental text chunks from the model.
    """
    llm = get_llm()

    logger.debug("[LLM] Sending %d messages to Groq (streaming).", len(messages))

    async for chunk in llm.astream(messages):
        token: str = chunk.content  # type: ignore[attr-defined]
        if token:
            yield token