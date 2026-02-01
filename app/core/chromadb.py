import chromadb
from app.utils.llm import embedding_function

# --- ChromaDB Setup ---
# Gunakan PersistentClient dan tentukan path untuk menyimpan database
client = chromadb.PersistentClient(path="./app/db/chroma_db")  # <-- Perbaikan di sini

# Sisa kode tetap sama
collection = client.get_or_create_collection("hr_knowledge")

# --- Embedding Model ---
embedding_model = embedding_function


