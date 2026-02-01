from langchain_chroma import Chroma
from app.utils.llm import embedding_function
from app.core.chromadb import client, collection

import logging


vectorstore = Chroma(
    client=client, collection_name="hr_knowledge", embedding_function=embedding_function
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
