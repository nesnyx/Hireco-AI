from langchain_chroma import Chroma
from app.utils.llm import embedding_function
from app.config.chromadb import client, collection
from langchain_huggingface.embeddings import HuggingFaceEmbeddings


embedding_model = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-base")

vectorstore = Chroma(
    client=client, collection_name="hr_knowledge", embedding_function=embedding_model
)


def check_applicant_exists(file_id: str) -> bool:
    results = vectorstore._collection.get(where={"file_id": file_id})
    return len(results["ids"]) > 0

def delete_applicant_vectordb(file_id: str):
    vectorstore.delete(where={"file_id": file_id})
    return True

