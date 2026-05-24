"""Tests for retriever.py — HybridRetriever."""

import os
from unittest.mock import patch, MagicMock, PropertyMock

import pytest
from langchain_core.documents import Document

from RAG.retriever import HybridRetriever


# ── Fixtures ─────────────────────────────────────────────────────────

@pytest.fixture()
def mock_hybrid(tmp_path):
    """Create a HybridRetriever with mocked sparse/dense/reranker backends."""
    bm25_path = str(tmp_path / "bm25.pkl")
    chroma_path = str(tmp_path / "chroma")

    # Create fake paths so the constructor enters the "exists" branches
    os.makedirs(chroma_path, exist_ok=True)
    # BM25 needs a real pickle file — create a minimal one
    import pickle
    with open(bm25_path, "wb") as f:
        pickle.dump({"docs": [], "vectorizer": None}, f)

    with (
        patch("RAG.retriever.BM25PersistentStore") as mock_store_cls,
        patch("RAG.retriever.PersistentBM25Retriever") as mock_bm25_cls,
        patch("RAG.retriever.Chroma") as mock_chroma_cls,
        patch("RAG.retriever.FlashRankReranker") as mock_reranker_cls,
        patch("RAG.retriever.BM25_PATH", bm25_path),
        patch("RAG.retriever.CHROMA_PATH", chroma_path),
    ):
        mock_bm25 = MagicMock()
        mock_bm25_cls.return_value = mock_bm25

        mock_dense = MagicMock()
        mock_chroma_cls.return_value = mock_dense

        mock_reranker = MagicMock()
        mock_reranker_cls.return_value = mock_reranker

        retriever = HybridRetriever(
            use_sparse=True,
            use_dense=True,
            use_reranker=True,
        )

        # Attach mocks for test access
        retriever._test_bm25 = mock_bm25
        retriever._test_dense = mock_dense
        retriever._test_reranker = mock_reranker

        yield retriever


def _make_docs(texts):
    """Helper: create Documents from a list of strings."""
    return [
        Document(page_content=t, metadata={"source": f"doc_{i}.txt", "chunk_idx": 0})
        for i, t in enumerate(texts)
    ]


# ── HybridRetriever ──────────────────────────────────────────────────

class TestHybridRetriever:
    def test_init_with_sparse_only(self, tmp_path):
        with (
            patch("RAG.retriever.BM25_PATH", str(tmp_path / "bm25.pkl")),
            patch("RAG.retriever.CHROMA_PATH", str(tmp_path / "chroma")),
            patch("RAG.retriever.BM25PersistentStore"),
            patch("RAG.retriever.PersistentBM25Retriever"),
            patch("RAG.retriever.os.path.exists", side_effect=lambda p: "bm25" in p),
        ):
            r = HybridRetriever(use_sparse=True, use_dense=False, use_reranker=False)
            assert r._sparse_retriever is not None
            assert r._dense_retriever is None
            assert r._reranker is None

    def test_init_with_dense_only(self, tmp_path):
        with (
            patch("RAG.retriever.BM25_PATH", str(tmp_path / "bm25.pkl")),
            patch("RAG.retriever.CHROMA_PATH", str(tmp_path / "chroma")),
            patch("RAG.retriever.Chroma"),
            patch("RAG.retriever.os.path.exists", side_effect=lambda p: "chroma" in p),
        ):
            r = HybridRetriever(use_sparse=False, use_dense=True, use_reranker=False)
            assert r._sparse_retriever is None
            assert r._dense_retriever is not None

    def test_init_no_backends(self):
        with patch("RAG.retriever.os.path.exists", return_value=False):
            r = HybridRetriever(use_sparse=False, use_dense=False, use_reranker=False)
            assert r._sparse_retriever is None
            assert r._dense_retriever is None
            assert r._reranker is None

    def test_retrieve_returns_list_of_dicts(self, mock_hybrid):
        docs = _make_docs(["Python is great", "ML is cool"])
        mock_hybrid._test_bm25._get_relevant_documents.return_value = docs
        mock_hybrid._test_dense.similarity_search.return_value = []
        mock_hybrid._test_reranker.rerank.return_value = docs

        results = mock_hybrid.retrieve("Python", top_k=5)
        assert isinstance(results, list)
        assert all(isinstance(r, dict) for r in results)

    def test_retrieve_empty_when_no_backends(self):
        with patch("RAG.retriever.os.path.exists", return_value=False):
            r = HybridRetriever(use_sparse=False, use_dense=False, use_reranker=False)
            results = r.retrieve("anything")
            assert results == []

    def test_deduplication(self, mock_hybrid):
        same_doc = Document(
            page_content="duplicate content",
            metadata={"source": "x.txt", "chunk_idx": 0},
        )
        mock_hybrid._test_bm25._get_relevant_documents.return_value = [same_doc, same_doc]
        mock_hybrid._test_dense.similarity_search.return_value = [same_doc]
        mock_hybrid._test_reranker.rerank.return_value = [same_doc]

        results = mock_hybrid.retrieve("test", top_k=5)
        # Should have been deduplicated before passing to reranker
        rerank_call_args = mock_hybrid._test_reranker.rerank.call_args[0][1]
        assert len(rerank_call_args) == 1

    def test_reranker_called_when_present(self, mock_hybrid):
        docs = _make_docs(["a", "b", "c"])
        mock_hybrid._test_bm25._get_relevant_documents.return_value = docs
        mock_hybrid._test_dense.similarity_search.return_value = []
        mock_hybrid._test_reranker.rerank.return_value = docs[:2]

        mock_hybrid.retrieve("test", top_k=2)
        mock_hybrid._test_reranker.rerank.assert_called_once()

    def test_truncates_without_reranker(self, tmp_path):
        with (
            patch("RAG.retriever.BM25_PATH", str(tmp_path / "bm25.pkl")),
            patch("RAG.retriever.CHROMA_PATH", str(tmp_path / "chroma")),
            patch("RAG.retriever.BM25PersistentStore"),
            patch("RAG.retriever.PersistentBM25Retriever"),
            patch("RAG.retriever.os.path.exists", side_effect=lambda p: "bm25" in p),
        ):
            r = HybridRetriever(use_sparse=True, use_dense=False, use_reranker=False)
            docs = _make_docs([f"doc {i}" for i in range(20)])
            r._sparse_retriever._get_relevant_documents.return_value = docs

            results = r.retrieve("test", top_k=3)
            assert len(results) == 3

    def test_result_dict_has_content_key(self, mock_hybrid):
        docs = _make_docs(["test content"])
        mock_hybrid._test_bm25._get_relevant_documents.return_value = docs
        mock_hybrid._test_dense.similarity_search.return_value = []
        mock_hybrid._test_reranker.rerank.return_value = docs

        results = mock_hybrid.retrieve("test", top_k=1)
        assert "content" in results[0]
        assert results[0]["content"] == "test content"

    def test_result_dict_has_source(self, mock_hybrid):
        docs = [Document(page_content="x", metadata={"source": "file.txt", "chunk_idx": 2})]
        mock_hybrid._test_bm25._get_relevant_documents.return_value = docs
        mock_hybrid._test_dense.similarity_search.return_value = []
        mock_hybrid._test_reranker.rerank.return_value = docs

        results = mock_hybrid.retrieve("test", top_k=1)
        assert results[0]["source"] == "file.txt"
        assert results[0]["chunk_idx"] == 2

    def test_removes_idx_from_results(self, mock_hybrid):
        docs = [Document(page_content="x", metadata={"source": "a.txt", "_idx": 99})]
        mock_hybrid._test_bm25._get_relevant_documents.return_value = docs
        mock_hybrid._test_dense.similarity_search.return_value = []
        mock_hybrid._test_reranker.rerank.return_value = docs

        results = mock_hybrid.retrieve("test", top_k=1)
        assert "_idx" not in results[0]

    def test_sparse_and_dense_combined(self, mock_hybrid):
        sparse_docs = _make_docs(["sparse result"])
        dense_docs = _make_docs(["dense result"])
        mock_hybrid._test_bm25._get_relevant_documents.return_value = sparse_docs
        mock_hybrid._test_dense.similarity_search.return_value = dense_docs
        mock_hybrid._test_reranker.rerank.return_value = sparse_docs + dense_docs

        mock_hybrid.retrieve("test", top_k=5)
        rerank_call_args = mock_hybrid._test_reranker.rerank.call_args[0][1]
        assert len(rerank_call_args) == 2

    def test_fetch_k_larger_than_top_k(self, mock_hybrid):
        mock_hybrid._test_bm25._get_relevant_documents.return_value = []
        mock_hybrid._test_dense.similarity_search.return_value = []

        mock_hybrid.retrieve("test", top_k=5)
        # fetch_k = max(5*3, 5+5) = 15
        sparse_call_k = mock_hybrid._test_bm25._get_relevant_documents.call_args[1].get(
            "top_k", mock_hybrid._test_bm25._get_relevant_documents.call_args[0][1] if len(mock_hybrid._test_bm25._get_relevant_documents.call_args[0]) > 1 else None
        )
        dense_call_k = mock_hybrid._test_dense.similarity_search.call_args[1].get(
            "k", mock_hybrid._test_dense.similarity_search.call_args[0][1] if len(mock_hybrid._test_dense.similarity_search.call_args[0]) > 1 else None
        )
        # Both should request more than top_k
        assert sparse_call_k >= 15 or dense_call_k >= 15
