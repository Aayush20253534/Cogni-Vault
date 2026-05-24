"""Tests for rag.py — KnowledgeRAG."""

import os
from unittest.mock import patch, MagicMock

import pytest
from langchain_core.documents import Document

from RAG.rag import KnowledgeRAG


# ── Fixtures ─────────────────────────────────────────────────────────

@pytest.fixture()
def mock_rag(tmp_path):
    """Create a KnowledgeRAG with all heavy dependencies mocked."""
    corpus_dir = str(tmp_path / "corpus")
    os.makedirs(corpus_dir, exist_ok=True)
    (tmp_path / "corpus" / "test.txt").write_text("Python is great.", encoding="utf-8")

    with (
        patch("RAG.rag.HybridRetriever") as mock_retriever_cls,
        patch("RAG.rag.load_corpus_from_directory") as mock_load,
        patch("RAG.rag.ingest_chunks") as mock_ingest,
    ):
        mock_retriever = MagicMock()
        mock_retriever_cls.return_value = mock_retriever
        mock_load.return_value = [
            {"source": "test.txt", "content": "Python is great.", "chunk_idx": 0}
        ]

        rag = KnowledgeRAG(knowledge_dir=corpus_dir)
        rag._test_retriever = mock_retriever

        yield rag


# ── KnowledgeRAG ─────────────────────────────────────────────────────

class TestKnowledgeRAG:
    @patch("RAG.rag.ingest_chunks")
    @patch("RAG.rag.load_corpus_from_directory")
    @patch("RAG.rag.HybridRetriever")
    def test_init_loads_corpus(self, mock_retriever, mock_load, mock_ingest, tmp_path):
        corpus_dir = str(tmp_path / "corpus")
        os.makedirs(corpus_dir)
        mock_load.return_value = [{"source": "a.txt", "content": "hello", "chunk_idx": 0}]

        KnowledgeRAG(knowledge_dir=corpus_dir)
        mock_load.assert_called_once_with(corpus_dir)
        mock_ingest.assert_called_once()

    @patch("RAG.rag.ingest_chunks")
    @patch("RAG.rag.load_corpus_from_directory")
    @patch("RAG.rag.HybridRetriever")
    def test_init_creates_retriever(self, mock_retriever_cls, mock_load, mock_ingest, tmp_path):
        corpus_dir = str(tmp_path / "corpus")
        os.makedirs(corpus_dir)
        mock_load.return_value = []

        rag = KnowledgeRAG(
            knowledge_dir=corpus_dir,
            use_sparse=True,
            use_dense=False,
            use_reranker=True,
        )
        mock_retriever_cls.assert_called_once_with(
            use_sparse=True,
            use_dense=False,
            use_reranker=True,
        )

    @patch("RAG.rag.ingest_chunks")
    @patch("RAG.rag.load_corpus_from_directory")
    @patch("RAG.rag.HybridRetriever")
    def test_init_passes_corpus_to_ingest(self, mock_retriever_cls, mock_load, mock_ingest, tmp_path):
        corpus_dir = str(tmp_path / "corpus")
        os.makedirs(corpus_dir)
        corpus = [
            {"source": "a.txt", "content": "chunk1", "chunk_idx": 0},
            {"source": "a.txt", "content": "chunk2", "chunk_idx": 1},
        ]
        mock_load.return_value = corpus

        KnowledgeRAG(knowledge_dir=corpus_dir)
        mock_ingest.assert_called_once_with(corpus)

    def test_retrieve_delegates_to_retriever(self, mock_rag):
        expected = [
            {"content": "Python is great.", "source": "test.txt", "chunk_idx": 0}
        ]
        mock_rag._test_retriever.retrieve.return_value = expected

        results = mock_rag.retrieve("What is Python?")
        assert results == expected
        mock_rag._test_retriever.retrieve.assert_called_once_with("What is Python?", top_k=5)

    def test_retrieve_custom_top_k(self, mock_rag):
        mock_rag._test_retriever.retrieve.return_value = []

        mock_rag.retrieve("test query", top_k=10)
        mock_rag._test_retriever.retrieve.assert_called_once_with("test query", top_k=10)

    def test_retrieve_returns_empty(self, mock_rag):
        mock_rag._test_retriever.retrieve.return_value = []

        results = mock_rag.retrieve("nonexistent topic")
        assert results == []

    @patch("RAG.rag.ingest_chunks")
    @patch("RAG.rag.load_corpus_from_directory")
    @patch("RAG.rag.HybridRetriever")
    def test_init_with_all_defaults(self, mock_retriever_cls, mock_load, mock_ingest, tmp_path):
        corpus_dir = str(tmp_path / "corpus")
        os.makedirs(corpus_dir)
        mock_load.return_value = []

        KnowledgeRAG(knowledge_dir=corpus_dir)
        mock_retriever_cls.assert_called_once_with(
            use_sparse=True,
            use_dense=True,
            use_reranker=True,
        )

    @patch("RAG.rag.ingest_chunks")
    @patch("RAG.rag.load_corpus_from_directory")
    @patch("RAG.rag.HybridRetriever")
    def test_init_empty_directory(self, mock_retriever_cls, mock_load, mock_ingest, tmp_path):
        corpus_dir = str(tmp_path / "empty")
        os.makedirs(corpus_dir)
        mock_load.return_value = []

        rag = KnowledgeRAG(knowledge_dir=corpus_dir)
        mock_ingest.assert_called_once_with([])

    def test_retrieve_query_passthrough(self, mock_rag):
        mock_rag._test_retriever.retrieve.return_value = []

        mock_rag.retrieve("complex query with special chars: @#$%")
        mock_rag._test_retriever.retrieve.assert_called_once_with(
            "complex query with special chars: @#$%", top_k=5
        )
