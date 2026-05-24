"""Shared fixtures for CogniVault RAG tests."""

import os
import sys
from unittest.mock import MagicMock

# Ensure backend/ is on sys.path so `RAG.*` imports resolve
_backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

# Mock sentence_transformers so langchain_huggingface can import it
_mock_st = MagicMock()
sys.modules["sentence_transformers"] = _mock_st

# Pre-import langchain_huggingface so we can patch HuggingFaceEmbeddings
# before RAG.retriever / RAG.ingestion do `from langchain_huggingface import ...`
import langchain_huggingface  # noqa: E402

_mock_embedding_instance = MagicMock()
_mock_embedding_cls = MagicMock(return_value=_mock_embedding_instance)
langchain_huggingface.HuggingFaceEmbeddings = _mock_embedding_cls

import pytest  # noqa: E402
from langchain_core.documents import Document  # noqa: E402

from .test_data import SAMPLE_DOCUMENTS  # noqa: E402


# ── Temp directories ─────────────────────────────────────────────────

@pytest.fixture()
def tmp_dir(tmp_path):
    """Provide a clean temporary directory, auto-cleaned after the test."""
    return tmp_path


@pytest.fixture()
def corpus_dir(tmp_path):
    """Create a temporary directory populated with sample knowledge files."""
    d = tmp_path / "corpus"
    d.mkdir()
    for name, content in SAMPLE_DOCUMENTS.items():
        (d / name).write_text(content, encoding="utf-8")
    return str(d)


@pytest.fixture()
def empty_dir(tmp_path):
    """An empty directory (no knowledge files)."""
    d = tmp_path / "empty"
    d.mkdir()
    return str(d)


# ── Tracking file ────────────────────────────────────────────────────

@pytest.fixture()
def tracking_file(tmp_path, monkeypatch):
    """Redirect the chunker's TRACKING_FILE to a temp path."""
    path = str(tmp_path / "processed_files.json")
    monkeypatch.setattr("RAG.chunker.TRACKING_FILE", path)
    return path


# ── Sample documents ─────────────────────────────────────────────────

@pytest.fixture()
def sample_documents():
    """Return a list of LangChain Documents for BM25 / ingestion tests."""
    return [
        Document(
            page_content="Python is a high-level programming language.",
            metadata={"source": "python_basics.txt", "chunk_idx": 0, "id": "doc-0"},
            id="doc-0",
        ),
        Document(
            page_content="Machine learning enables systems to learn from data.",
            metadata={"source": "machine_learning.md", "chunk_idx": 0, "id": "doc-1"},
            id="doc-1",
        ),
        Document(
            page_content="Databases store and organize structured information.",
            metadata={"source": "databases.txt", "chunk_idx": 0, "id": "doc-2"},
            id="doc-2",
        ),
        Document(
            page_content="REST APIs use HTTP methods for resource manipulation.",
            metadata={"source": "web_development.md", "chunk_idx": 0, "id": "doc-3"},
            id="doc-3",
        ),
    ]


@pytest.fixture()
def sample_chunks():
    """Return chunk dicts matching the format produced by chunk_text()."""
    return [
        {"source": "python_basics.txt", "content": "Python is a high-level programming language.", "chunk_idx": 0},
        {"source": "machine_learning.md", "content": "Machine learning enables systems to learn from data.", "chunk_idx": 0},
        {"source": "databases.txt", "content": "Databases store and organize structured information.", "chunk_idx": 0},
        {"source": "web_development.md", "content": "REST APIs use HTTP methods for resource manipulation.", "chunk_idx": 0},
    ]


@pytest.fixture()
def large_document_set():
    """Generate 50 documents for stress / pagination tests."""
    return [
        Document(
            page_content=f"Document number {i} discusses topic {i % 10}.",
            metadata={"source": f"doc_{i}.txt", "chunk_idx": 0, "id": f"doc-{i}"},
            id=f"doc-{i}",
        )
        for i in range(50)
    ]
