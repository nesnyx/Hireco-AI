from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from app.core.env import env_config

API_KEY = env_config.get("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(api_key=API_KEY, model="gemini-2.0-flash", temperature=0.1)

EMBEDDING_MODEL = "models/gemini-embedding-001"

embedding_function = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL, google_api_key=API_KEY
)
