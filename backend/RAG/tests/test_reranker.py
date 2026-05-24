"""Tests for reranker.py — FlashRankReranker."""

import pytest
from unittest.mock import patch, MagicMock
from langchain_core.documents import Document

from RAG.reranker import FlashRankReranker


# ── Fixtures ─────────────────────────────────────────────────────────

@pytest.fixture()
def mock_ranker():
    """Patch flashrank.Ranker so no model is actually downloaded."""
    with patch("RAG.reranker.FlashRankReranker.__init__", lambda self, **kw: None):
        reranker = FlashRankReranker.__new__(FlashRankReranker)
        reranker.top_k = 5
        reranker._model_name = "ms-marco-MiniLM-L-12-v2"
        reranker._ranker = MagicMock()
        yield reranker


@pytest.fixture()
def reranker_docs():
    return [
        Document(
            page_content="Python is a programming language.",
            metadata={"source": "python.txt", "chunk_idx": 0},
        ),
        Document(
            page_content="Machine learning uses data to train models.",
            metadata={"source": "ml.md", "chunk_idx": 0},
        ),
        Document(
            page_content="Databases store structured information.",
            metadata={"source": "db.txt", "chunk_idx": 0},
        ),
    ]


# ── FlashRankReranker.rerank ─────────────────────────────────────────

class TestRerank:
    def test_returns_list_of_documents(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.return_value = [
            {"id": 1, "text": reranker_docs[1].page_content, "score": 0.95, "meta": {}},
            {"id": 0, "text": reranker_docs[0].page_content, "score": 0.80, "meta": {}},
            {"id": 2, "text": reranker_docs[2].page_content, "score": 0.60, "meta": {}},
        ]

        results = mock_ranker.rerank("programming", reranker_docs)
        assert isinstance(results, list)
        assert all(isinstance(d, Document) for d in results)

    def test_respects_top_k(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.return_value = [
            {"id": 1, "text": "t", "score": 0.95, "meta": {}},
            {"id": 0, "text": "t", "score": 0.80, "meta": {}},
            {"id": 2, "text": "t", "score": 0.60, "meta": {}},
        ]

        results = mock_ranker.rerank("test", reranker_docs, top_k=2)
        assert len(results) == 2

    def test_top_k_defaults_to_self(self, mock_ranker, reranker_docs):
        mock_ranker.top_k = 2
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "t", "score": 0.9, "meta": {}},
            {"id": 1, "text": "t", "score": 0.8, "meta": {}},
            {"id": 2, "text": "t", "score": 0.7, "meta": {}},
        ]

        results = mock_ranker.rerank("test", reranker_docs)
        assert len(results) == 2

    def test_top_k_clamped_to_doc_count(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "t", "score": 0.9, "meta": {}},
        ]

        results = mock_ranker.rerank("test", reranker_docs, top_k=100)
        assert len(results) <= len(reranker_docs)

    def test_empty_documents(self, mock_ranker):
        results = mock_ranker.rerank("test", [])
        assert results == []

    def test_rerank_score_in_metadata(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "t", "score": 0.12345, "meta": {}},
        ]

        results = mock_ranker.rerank("test", reranker_docs, top_k=1)
        assert "rerank_score" in results[0].metadata
        assert results[0].metadata["rerank_score"] == 0.1235  # rounded to 4 places

    def test_preserves_original_content(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.return_value = [
            {"id": 1, "text": "x", "score": 0.9, "meta": {}},
        ]

        results = mock_ranker.rerank("test", reranker_docs, top_k=1)
        assert results[0].page_content == reranker_docs[1].page_content

    def test_preserves_original_metadata(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "x", "score": 0.9, "meta": {}},
        ]

        results = mock_ranker.rerank("test", reranker_docs, top_k=1)
        assert results[0].metadata["source"] == "python.txt"
        assert results[0].metadata["chunk_idx"] == 0

    def test_fallback_on_exception(self, mock_ranker, reranker_docs):
        mock_ranker._ranker.rerank.side_effect = RuntimeError("model failed")

        results = mock_ranker.rerank("test", reranker_docs, top_k=2)
        # Should fall back to original order, truncated to top_k
        assert len(results) == 2
        assert results[0].page_content == reranker_docs[0].page_content


# ── FlashRankReranker.rerank_dicts ───────────────────────────────────

class TestRerankDicts:
    def test_returns_list_of_dicts(self, mock_ranker):
        chunks = [
            {"content": "Python is great", "source": "a.txt"},
            {"content": "ML is cool", "source": "b.md"},
        ]
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "x", "score": 0.9, "meta": {}},
            {"id": 1, "text": "x", "score": 0.8, "meta": {}},
        ]

        results = mock_ranker.rerank_dicts("test", chunks)
        assert isinstance(results, list)
        assert all(isinstance(d, dict) for d in results)

    def test_preserves_content_key(self, mock_ranker):
        chunks = [{"content": "hello world", "source": "x.txt"}]
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "x", "score": 0.9, "meta": {}},
        ]

        results = mock_ranker.rerank_dicts("test", chunks, top_k=1)
        assert results[0]["content"] == "hello world"

    def test_adds_rerank_score(self, mock_ranker):
        chunks = [{"content": "test", "source": "x.txt"}]
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "x", "score": 0.7777, "meta": {}},
        ]

        results = mock_ranker.rerank_dicts("test", chunks, top_k=1)
        assert "rerank_score" in results[0]

    def test_custom_content_key(self, mock_ranker):
        chunks = [{"text": "hello", "source": "x.txt"}]
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "x", "score": 0.9, "meta": {}},
        ]

        results = mock_ranker.rerank_dicts("test", chunks, top_k=1, content_key="text")
        assert results[0]["content"] == "hello"

    def test_empty_chunks(self, mock_ranker):
        results = mock_ranker.rerank_dicts("test", [])
        assert results == []

    def test_preserves_extra_metadata(self, mock_ranker):
        chunks = [{"content": "hello", "source": "x.txt", "chunk_idx": 3, "extra": "data"}]
        mock_ranker._ranker.rerank.return_value = [
            {"id": 0, "text": "x", "score": 0.9, "meta": {}},
        ]

        results = mock_ranker.rerank_dicts("test", chunks, top_k=1)
        assert results[0]["source"] == "x.txt"
        assert results[0]["chunk_idx"] == 3
        assert results[0]["extra"] == "data"
