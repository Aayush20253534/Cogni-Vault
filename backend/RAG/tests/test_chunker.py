"""Tests for chunker.py — chunking, hashing, tracking, and corpus loading."""

import json
import os

import pytest

from RAG.chunker import (
    chunk_text,
    get_file_hash,
    load_tracking,
    save_tracking,
    load_corpus_from_directory,
)

from .test_data import SAMPLE_DOCUMENTS, PYTHON_BASICS_EXPECTED_MIN_CHUNKS


# ── chunk_text ───────────────────────────────────────────────────────

class TestChunkText:
    def test_returns_list_of_dicts(self):
        result = chunk_text("Hello world. This is a test.", source="test.txt")
        assert isinstance(result, list)
        assert all(isinstance(c, dict) for c in result)

    def test_dict_keys(self):
        result = chunk_text("Some text content here.", source="src.md")
        for chunk in result:
            assert "source" in chunk
            assert "content" in chunk
            assert "chunk_idx" in chunk

    def test_source_preserved(self):
        result = chunk_text("Some text.", source="myfile.txt")
        assert all(c["source"] == "myfile.txt" for c in result)

    def test_chunk_idx_sequential(self):
        text = "word " * 500  # long enough to produce multiple chunks
        result = chunk_text(text, source="x.txt", chunk_size=50, overlap=10)
        indices = [c["chunk_idx"] for c in result]
        assert indices == list(range(len(result)))

    def test_empty_text(self):
        result = chunk_text("", source="empty.txt")
        # empty string produces no chunks
        assert result == [] or (len(result) == 1 and result[0]["content"] == "")

    def test_short_text_single_chunk(self):
        result = chunk_text("Short.", source="s.txt")
        assert len(result) == 1
        assert result[0]["content"] == "Short."
        assert result[0]["chunk_idx"] == 0

    def test_chunk_size_respected(self):
        text = "a" * 1000
        result = chunk_text(text, source="x.txt", chunk_size=200, overlap=50)
        for chunk in result:
            # chunks may be slightly over due to splitter behavior, but should be close
            assert len(chunk["content"]) <= 250

    def test_overlap_creates_more_chunks(self):
        text = "word " * 200
        no_overlap = chunk_text(text, source="x.txt", chunk_size=100, overlap=0)
        with_overlap = chunk_text(text, source="x.txt", chunk_size=100, overlap=50)
        # overlap should produce more or equal chunks
        assert len(with_overlap) >= len(no_overlap)

    def test_realistic_document(self):
        text = SAMPLE_DOCUMENTS["python_basics.txt"]
        result = chunk_text(text, source="python_basics.txt")
        assert len(result) >= PYTHON_BASICS_EXPECTED_MIN_CHUNKS
        # All content from original should be representable
        full_content = " ".join(c["content"] for c in result)
        assert "Python" in full_content
        assert "Guido van Rossum" in full_content


# ── get_file_hash ────────────────────────────────────────────────────

class TestGetFileHash:
    def test_returns_string(self):
        result = get_file_hash("hello")
        assert isinstance(result, str)

    def test_deterministic(self):
        assert get_file_hash("test") == get_file_hash("test")

    def test_different_inputs_different_hashes(self):
        assert get_file_hash("abc") != get_file_hash("def")

    def test_sha256_length(self):
        result = get_file_hash("anything")
        assert len(result) == 64  # SHA-256 hex digest

    def test_empty_string(self):
        result = get_file_hash("")
        assert len(result) == 64

    def test_unicode_content(self):
        h1 = get_file_hash("日本語テスト")
        h2 = get_file_hash("hello world")
        assert h1 != h2
        assert len(h1) == 64


# ── load_tracking / save_tracking ────────────────────────────────────

class TestTracking:
    def test_load_tracking_missing_file(self, tracking_file):
        result = load_tracking()
        assert result == {}

    def test_save_and_load_roundtrip(self, tracking_file):
        data = {"file1.txt": "abc123", "file2.md": "def456"}
        save_tracking(data)
        loaded = load_tracking()
        assert loaded == data

    def test_save_tracking_writes_to_path(self, tmp_path, monkeypatch):
        # save_tracking hardcodes os.makedirs("data", ...), so we point
        # TRACKING_FILE at a path inside that directory tree to match.
        target = str(tmp_path / "data" / "processed_files.json")
        monkeypatch.setattr("RAG.chunker.TRACKING_FILE", target)
        # Also patch os.makedirs so "data" is created under tmp_path
        monkeypatch.chdir(tmp_path)
        save_tracking({"a": "b"})
        assert os.path.exists(target)

    def test_overwrite_existing(self, tracking_file):
        save_tracking({"a": "1"})
        save_tracking({"b": "2"})
        loaded = load_tracking()
        assert loaded == {"b": "2"}


# ── load_corpus_from_directory ───────────────────────────────────────

class TestLoadCorpusFromDirectory:
    def test_returns_list_of_dicts(self, corpus_dir, tracking_file):
        result = load_corpus_from_directory(corpus_dir)
        assert isinstance(result, list)
        assert all(isinstance(c, dict) for c in result)

    def test_nonexistent_dir_returns_empty(self, tmp_path, tracking_file):
        result = load_corpus_from_directory(str(tmp_path / "does_not_exist"))
        assert result == []

    def test_empty_dir_returns_empty(self, empty_dir, tracking_file):
        result = load_corpus_from_directory(empty_dir)
        assert result == []

    def test_txt_and_md_files_loaded(self, corpus_dir, tracking_file):
        result = load_corpus_from_directory(corpus_dir)
        sources = {c["source"] for c in result}
        assert "python_basics.txt" in sources
        assert "machine_learning.md" in sources

    def test_non_txt_md_files_ignored(self, tmp_path, tracking_file):
        (tmp_path / "data.csv").write_text("a,b,c", encoding="utf-8")
        (tmp_path / "readme.md").write_text("# Hello", encoding="utf-8")
        result = load_corpus_from_directory(str(tmp_path))
        sources = {c["source"] for c in result}
        assert "data.csv" not in sources
        assert "readme.md" in sources

    def test_deduplication_on_second_run(self, corpus_dir, tracking_file):
        first_run = load_corpus_from_directory(corpus_dir)
        second_run = load_corpus_from_directory(corpus_dir)
        # Second run should return empty (no changes)
        assert second_run == []

    def test_detects_file_changes(self, corpus_dir, tracking_file):
        load_corpus_from_directory(corpus_dir)

        # Modify a file
        filepath = os.path.join(corpus_dir, "python_basics.txt")
        with open(filepath, "a", encoding="utf-8") as f:
            f.write("\nPython 4.0 is coming!")

        second_run = load_corpus_from_directory(corpus_dir)
        sources = {c["source"] for c in second_run}
        assert "python_basics.txt" in sources
        # Unchanged files should not appear
        assert "machine_learning.md" not in sources

    def test_all_chunks_have_required_keys(self, corpus_dir, tracking_file):
        result = load_corpus_from_directory(corpus_dir)
        for chunk in result:
            assert "source" in chunk
            assert "content" in chunk
            assert "chunk_idx" in chunk

    def test_small_file(self, tmp_path, tracking_file):
        (tmp_path / "tiny.txt").write_text("Hi", encoding="utf-8")
        result = load_corpus_from_directory(str(tmp_path))
        assert len(result) >= 1
        assert result[0]["content"] == "Hi"
