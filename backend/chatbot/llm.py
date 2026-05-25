from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is not set in .env")

class LLMHandler:
    def __init__(self, model_name="openai/gpt-oss-120b", temperature=0.7, max_tokens=2048):
        self.llm = ChatGroq(
            model=model_name,
            api_key=api_key,
            temperature=temperature,
            max_tokens=max_tokens,
            streaming=True
        )
        
        self.system_prompt = (
            "You are a helpful, knowledgeable assistant. Use the provided context "
            "and conversation history to answer the user's query accurately."
        )

    def generate(self, prompt: str) -> str:
        """Standard generation returning a complete string."""
        messages = [HumanMessage(content=prompt)]
        response = self.llm.invoke(messages)
        return response.content

    def stream_generate(self, prompt: str):
        """Yields chunks of the response as they are generated."""
        messages = [HumanMessage(content=prompt)]
        for chunk in self.llm.stream(messages):
            yield chunk.content