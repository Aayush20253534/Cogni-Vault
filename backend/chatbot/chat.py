from .memory import get_recent_messages, format_memory, save_message
from .llm import LLMHandler
from RAG.rag import KnowledgeRAG

rag = KnowledgeRAG(knowledge_dir="./knowledge")
llm_handler = LLMHandler()

def _build_prompt(query, memory_text, context_text):
    """Helper to construct the final prompt sent to the LLM."""
    return f"""Answer the user's query based on the retrieved context.

--- Retrieved Context ---
{context_text}

--- Recent Conversation ---
{memory_text}

--- User Query ---
{query}
"""

def chat(query, user_id, session_id):
    """Handles a standard, non-streaming chat request."""
    # 1. Fetch memory
    recent_msgs = get_recent_messages(user_id, session_id)
    memory_text = format_memory(recent_msgs)

    # 2. Fetch Knowledge RAG Context
    retrieved_chunks = rag.retrieve(query)
    context_text = "\n".join(retrieved_chunks) if isinstance(retrieved_chunks, list) else retrieved_chunks

    # 3. Combine
    prompt = _build_prompt(query, memory_text, context_text)

    # 4. Generate
    response = llm_handler.generate(prompt)

    # 5. Save State
    save_message(user_id, session_id, "user", query)
    save_message(user_id, session_id, "assistant", response)

    return response

def chat_stream(query, user_id, session_id):
    """Handles a streaming chat request, saving the response after completion."""
    # 1. Fetch memory
    recent_msgs = get_recent_messages(user_id, session_id)
    memory_text = format_memory(recent_msgs)

    # 2. Fetch Knowledge RAG Context
    retrieved_chunks = rag.retrieve(query)
    context_text = "\n".join(retrieved_chunks) if isinstance(retrieved_chunks, list) else retrieved_chunks

    # 3. Combine
    prompt = _build_prompt(query, memory_text, context_text)

    # 4. Stream & Accumulate
    save_message(user_id, session_id, "user", query)
    
    full_response = []
    for chunk in llm_handler.stream_generate(prompt):
        full_response.append(chunk)
        yield chunk

    # 5. Save Final Assistant State
    complete_text = "".join(full_response)
    save_message(user_id, session_id, "assistant", complete_text)