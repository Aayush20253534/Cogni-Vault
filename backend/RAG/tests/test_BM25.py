"""Tests for BM25.py — BM25PersistentStore and PersistentBM25Retriever."""

import os
import pickle

import pytest
from langchain_core.documents import Document

from RAG.BM25 import BM25PersistentStore, PersistentBM25Retriever, default_preprocessing_func


# ── default_preprocessing_func ───────────────────────────────────────

class TestDefaultPreprocessing:
    def test_lowercases_and_splits(self):
        assert default_preprocessing_func("Hello World") == ["hello", "world"]

    def test_empty_string(self):
        assert default_preprocessing_func("") == []

    def test_multiple_spaces(self):
        # split() collapses whitespace
        result = default_preprocessing_func("  foo   bar  baz  ")
        assert result == ["foo", "bar", "baz"]

    def test_punctuation_kept(self):
        # default func does NOT strip punctuation
        result = default_preprocessing_func("hello, world!")
        assert result == ["hello,", "world!"]


# ── BM25PersistentStore ──────────────────────────────────────────────

class TestBM25PersistentStore:
    def test_build_creates_index_and_saves(self, tmp_path, sample_documents):
        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path)
        store.build(sample_documents)

        assert store.vectorizer is not None
        assert len(store.docs) == len(sample_documents)
        assert os.path.exists(store_path)

    def test_load_restores_state(self, tmp_path, sample_documents):
        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path)
        store.build(sample_documents)

        # Fresh store loads from disk
        loaded = BM25PersistentStore(path=store_path)
        loaded.load()

        assert len(loaded.docs) == len(sample_documents)
        assert loaded.vectorizer is not None
        assert loaded.docs[0].page_content == sample_documents[0].page_content

    def test_load_missing_file_raises(self, tmp_path):
        store = BM25PersistentStore(path=str(tmp_path / "nonexistent.pkl"))
        with pytest.raises(FileNotFoundError, match="No BM25 index found"):
            store.load()

    def test_add_documents_to_empty_store_builds(self, tmp_path, sample_documents):
        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path)
        store.add_documents(sample_documents)

        assert len(store.docs) == len(sample_documents)
        assert store.vectorizer is not None

    def test_add_documents_extends_existing(self, tmp_path, sample_documents):
        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path)
        store.build(sample_documents[:2])

        extra = sample_documents[2:]
        store.add_documents(extra)

        assert len(store.docs) == len(sample_documents)
        # Verify persistence
        loaded = BM25PersistentStore(path=store_path)
        loaded.load()
        assert len(loaded.docs) == len(sample_documents)

    def test_build_with_empty_list_raises(self, tmp_path):
        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path)
        # BM25Okapi raises ZeroDivisionError on empty corpus
        with pytest.raises(ZeroDivisionError):
            store.build([])

    def test_custom_preprocess_func(self, tmp_path, sample_documents):
        def char_tokenize(text):
            return list(text.lower())

        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path, preprocess_func=char_tokenize)
        store.build(sample_documents)

        assert store.vectorizer is not None

    def test_save_creates_parent_dirs(self, tmp_path):
        nested = str(tmp_path / "a" / "b" / "c" / "bm25.pkl")
        store = BM25PersistentStore(path=nested)
        store.build([Document(page_content="test", metadata={"id": "x"})])

        assert os.path.exists(nested)


# ── PersistentBM25Retriever ──────────────────────────────────────────

class TestPersistentBM25Retriever:
    def _make_retriever(self, tmp_path, documents, k=4):
        store_path = str(tmp_path / "bm25.pkl")
        store = BM25PersistentStore(path=store_path)
        store.build(documents)
        return PersistentBM25Retriever(store=store, k=k)

    def test_basic_retrieval(self, tmp_path, sample_documents):
        retriever = self._make_retriever(tmp_path, sample_documents)
        results = retriever._get_relevant_documents("Python programming")

        assert len(results) <= 4
        assert all(isinstance(doc, Document) for doc in results)
        # Python doc should be in results
        contents = [doc.page_content for doc in results]
        assert any("Python" in c for c in contents)

    def test_top_k_limit(self, tmp_path, sample_documents):
        retriever = self._make_retriever(tmp_path, sample_documents, k=2)
        results = retriever._get_relevant_documents("database")

        assert len(results) <= 2

    def test_top_k_override(self, tmp_path, sample_documents):
        retriever = self._make_retriever(tmp_path, sample_documents, k=4)
        results = retriever._get_relevant_documents("machine learning", top_k=1)

        assert len(results) == 1

    def test_uninitialized_store_raises(self, tmp_path):
        store = BM25PersistentStore(path=str(tmp_path / "empty.pkl"))
        retriever = PersistentBM25Retriever(store=store, k=4)

        with pytest.raises(ValueError, match="BM25 index not initialized"):
            retriever._get_relevant_documents("test query")

    def test_returns_relevant_results(self, tmp_path):
        docs = [
            Document(page_content="cats are furry animals", metadata={"id": "a"}),
            Document(page_content="dogs are loyal pets", metadata={"id": "b"}),
            Document(page_content="Python is a programming language", metadata={"id": "c"}),
        ]
        retriever = self._make_retriever(tmp_path, docs, k=2)
        results = retriever._get_relevant_documents("programming language")

        contents = [doc.page_content for doc in results]
        assert any("Python" in c for c in contents)

    def test_empty_query(self, tmp_path, sample_documents):
        retriever = self._make_retriever(tmp_path, sample_documents)
        results = retriever._get_relevant_documents("")

        assert isinstance(results, list)

    def test_large_k_returns_all_available(self, tmp_path, sample_documents):
        retriever = self._make_retriever(tmp_path, sample_documents, k=100)
        results = retriever._get_relevant_documents("test")

        assert len(results) == len(sample_documents)
