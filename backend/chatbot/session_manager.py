import sqlite3
import uuid
from datetime import datetime

DB_PATH = "data/chatbot.db"

def init_session_db():
    """Initializes the sessions table."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT,
                created_at TEXT
            )
        ''')

def create_session(user_id):
    """Creates a new session and returns the session_id."""
    session_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "INSERT INTO sessions (session_id, user_id, created_at) VALUES (?, ?, ?)",
            (session_id, user_id, created_at)
        )
    return session_id

def get_session(session_id):
    """Retrieves a single session by its ID."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,))
        return dict(cursor.fetchone()) if cursor.fetchone() else None

def get_user_sessions(user_id):
    """Retrieves all sessions for a specific user."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.execute(
            "SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC", 
            (user_id,)
        )
        return [dict(row) for row in cursor.fetchall()]

def delete_session(session_id):
    """Deletes a session from the database."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))

# Initialize table on import
init_session_db()