from langchain_chroma import Chroma
from app.utils.llm import embedding_function
from app.config.chromadb import client, collection
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import logging

# embedding_model = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-base")
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma(
    client=client, collection_name="hr_knowledge", embedding_function=embedding_model
)

logger = logging.getLogger(__name__)


def check_applicant_exists(file_id: str) -> bool:
    results = vectorstore._collection.get(where={"file_id": file_id})
    return len(results["ids"]) > 0


def delete_applicant_vectordb(file_id: str):
    vectorstore.delete(where={"file_id": file_id})
    return True


def upsert_applicant_to_vectordb(documents, file_id, vectorstore) -> None:
    """
    Menyimpan dokumen ke vector DB setelah memastikan tidak ada duplikat berdasarkan file_id.
    Jika sudah ada, hapus dulu sebelum insert (simulasi upsert).
    """
    if check_applicant_exists(file_id):
        logger.info(
            f"Applicant with file_id={file_id} already exists. Removing old entries..."
        )
        delete_applicant_vectordb(file_id)

    logger.info(
        f"Adding {len(documents)} new chunks for file_id={file_id} to vector DB."
    )
    vectorstore.add_documents(documents=documents)
