import sqlite3
from datetime import datetime

DB_PATH = "data/chatbot.db"

def init_memory_db():
    """Initializes the messages table."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                session_id TEXT,
                role TEXT,
                message TEXT,
                timestamp TEXT
            )
        ''')

def save_message(user_id, session_id, role, message):
    """Saves a single message (user or assistant) to memory."""
    timestamp = datetime.utcnow().isoformat()
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "INSERT INTO messages (user_id, session_id, role, message, timestamp) VALUES (?, ?, ?, ?, ?)",
            (user_id, session_id, role, message, timestamp)
        )

def get_recent_messages(user_id, session_id, limit=10):
    """Retrieves the most recent messages for a session to build context."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        # Fetch descending to get latest, then reverse to chronological order
        cursor = conn.execute('''
            SELECT role, message FROM messages 
            WHERE user_id = ? AND session_id = ? 
            ORDER BY timestamp DESC LIMIT ?
        ''', (user_id, session_id, limit))
        
        messages = [dict(row) for row in cursor.fetchall()]
        return messages[::-1]

def format_memory(messages):
    """Formats the retrieved dictionary messages into a continuous string."""
    if not messages:
        return "No prior conversation."
    
    formatted = []
    for msg in messages:
        role_label = "User" if msg["role"] == "user" else "Assistant"
        formatted.append(f"{role_label}: {msg['message']}")
        
    return "\n".join(formatted)

# Initialize table on import
init_memory_db()