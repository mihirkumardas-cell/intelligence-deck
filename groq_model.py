from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
load_dotenv()

def load_llm():
    llm=ChatGroq(
    groq_api_key = os.getenv("GROQ_API_KEY"),
    model_name='openai/gpt-oss-120b',
    temperature=0.5
    )
    return llm