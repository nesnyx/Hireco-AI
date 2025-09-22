from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain_ollama.chat_models import ChatOllama
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")
# llm = ChatGoogleGenerativeAI(api_key=API_KEY, model="gemini-2.5-flash", temperature=0.1)
llm = ChatOllama(model="llama3.1:8b",temperature=0.1,base_url="https://crane-primary-singularly.ngrok-free.app")

EMBEDDING_MODEL = "models/embedding-001"

embedding_function = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004", google_api_key=API_KEY
)
