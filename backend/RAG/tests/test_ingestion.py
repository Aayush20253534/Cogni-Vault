"""Tests for ingestion.py — chunks_to_documents, store_in_chroma, store_in_bm25, ingest_chunks."""

import os
from unittest.mock import patch, MagicMock

import pytest
from langchain_core.documents import Document

from RAG.ingestion import chunks_to_documents, ingest_chunks


# ── chunks_to_documents ──────────────────────────────────────────────

class TestChunksToDocuments:
    def test_returns_list_of_documents(self, sample_chunks):
        docs = chunks_to_documents(sample_chunks)
        assert isinstance(docs, list)
        assert all(isinstance(d, Document) for d in docs)

    def test_preserves_content(self, sample_chunks):
        docs = chunks_to_documents(sample_chunks)
        for doc, chunk in zip(docs, sample_chunks):
            assert doc.page_content == chunk["content"]

    def test_preserves_metadata(self, sample_chunks):
        docs = chunks_to_documents(sample_chunks)
        for doc, chunk in zip(docs, sample_chunks):
            assert doc.metadata["source"] == chunk["source"]
            assert doc.metadata["chunk_idx"] == chunk["chunk_idx"]

    def test_generates_unique_ids(self, sample_chunks):
        docs = chunks_to_documents(sample_chunks)
        ids = [doc.id for doc in docs]
        assert len(ids) == len(set(ids)), "All document IDs should be unique"

    def test_id_in_metadata(self, sample_chunks):
        docs = chunks_to_documents(sample_chunks)
        for doc in docs:
            assert doc.metadata["id"] == doc.id

    def test_empty_input(self):
        docs = chunks_to_documents([])
        assert docs == []

    def test_single_chunk(self):
        chunks = [{"source": "x.txt", "content": "hello", "chunk_idx": 0}]
        docs = chunks_to_documents(chunks)
        assert len(docs) == 1
        assert docs[0].page_content == "hello"


# ── store_in_chroma ──────────────────────────────────────────────────

class TestStoreInChroma:
    @patch("RAG.ingestion.Chroma")
    @patch("RAG.ingestion.os.path.exists", return_value=False)
    def test_creates_new_store(self, mock_exists, mock_chroma, sample_documents):
        from RAG.ingestion import store_in_chroma

        store_in_chroma(sample_documents)
        mock_chroma.from_documents.assert_called_once()
        call_kwargs = mock_chroma.from_documents.call_args
        assert call_kwargs[1]["documents"] == sample_documents

    @patch("RAG.ingestion.Chroma")
    @patch("RAG.ingestion.os.path.exists", return_value=True)
    def test_adds_to_existing_store(self, mock_exists, mock_chroma, sample_documents):
        from RAG.ingestion import store_in_chroma

        mock_instance = MagicMock()
        mock_chroma.return_value = mock_instance

        store_in_chroma(sample_documents)
        mock_instance.add_documents.assert_called_once_with(sample_documents)

    @patch("RAG.ingestion.Chroma")
    def test_empty_documents_noop(self, mock_chroma):
        from RAG.ingestion import store_in_chroma

        store_in_chroma([])
        mock_chroma.from_documents.assert_not_called()
        mock_chroma.assert_not_called()


# ── store_in_bm25 ────────────────────────────────────────────────────

class TestStoreInBM25:
    @patch("RAG.ingestion.BM25PersistentStore")
    @patch("RAG.ingestion.os.path.exists", return_value=False)
    def test_builds_new_store(self, mock_exists, mock_store_cls, sample_documents):
        from RAG.ingestion import store_in_bm25

        mock_instance = MagicMock()
        mock_store_cls.return_value = mock_instance

        store_in_bm25(sample_documents)
        mock_instance.build.assert_called_once_with(sample_documents)

    @patch("RAG.ingestion.BM25PersistentStore")
    @patch("RAG.ingestion.os.path.exists", return_value=True)
    def test_loads_and_adds_to_existing(self, mock_exists, mock_store_cls, sample_documents):
        from RAG.ingestion import store_in_bm25

        mock_instance = MagicMock()
        mock_store_cls.return_value = mock_instance

        store_in_bm25(sample_documents)
        mock_instance.load.assert_called_once()
        mock_instance.add_documents.assert_called_once_with(sample_documents)


# ── ingest_chunks ────────────────────────────────────────────────────

class TestIngestChunks:
    @patch("RAG.ingestion.store_in_bm25")
    @patch("RAG.ingestion.store_in_chroma")
    def test_full_pipeline(self, mock_chroma, mock_bm25, sample_chunks):
        ingest_chunks(sample_chunks)

        mock_chroma.assert_called_once()
        mock_bm25.assert_called_once()
        # Both should receive the same documents
        chroma_docs = mock_chroma.call_args[0][0]
        bm25_docs = mock_bm25.call_args[0][0]
        assert len(chroma_docs) == len(bm25_docs) == len(sample_chunks)

    @patch("RAG.ingestion.store_in_bm25")
    @patch("RAG.ingestion.store_in_chroma")
    def test_empty_chunks_noop(self, mock_chroma, mock_bm25):
        ingest_chunks([])
        mock_chroma.assert_not_called()
        mock_bm25.assert_not_called()

    @patch("RAG.ingestion.store_in_bm25")
    @patch("RAG.ingestion.store_in_chroma")
    def test_documents_created_from_chunks(self, mock_chroma, mock_bm25):
        chunks = [
            {"source": "a.txt", "content": "hello", "chunk_idx": 0},
            {"source": "a.txt", "content": "world", "chunk_idx": 1},
        ]
        ingest_chunks(chunks)

        docs = mock_chroma.call_args[0][0]
        assert docs[0].page_content == "hello"
        assert docs[1].page_content == "world"
        assert docs[0].metadata["source"] == "a.txt"
