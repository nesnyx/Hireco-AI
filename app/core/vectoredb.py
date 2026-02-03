from typing import List
from langchain_chroma import Chroma
from app.utils.llm import embedding_function
from app.core.chromadb import client, collection
from langchain_core.documents import Document
import logging,asyncio


vectorstore = Chroma(
    client=client, 
    collection_name=collection.name, 
    embedding_function=embedding_function
)

logger = logging.getLogger(__name__)


def check_applicant_exists(file_id: str) -> bool:
    results = vectorstore._collection.get(where={"file_id": file_id})
    return len(results["ids"]) > 0


async def delete_applicant_vectordb(file_id: str):
    loop = asyncio.get_running_loop()
    try:
        await loop.run_in_executor(
            None, 
            lambda: vectorstore.delete(where={"file_id": file_id})
        )
    except Exception as e:
        logger.error(f"Error saat menghapus data lama file_id {file_id}: {str(e)}")


async def upsert_applicant_to_vectordb(
    documents: List[Document], 
    file_id: str, 
    vectorstore: Chroma
) -> None:
    if not documents:
        logger.warning(f"Tidak ada dokumen untuk di-upsert untuk file_id: {file_id}")
        return
    logger.info(f"Cleaning up old entries for file_id: {file_id}")
    await delete_applicant_vectordb(file_id)
    logger.info(f"Adding {len(documents)} new chunks for file_id: {file_id}")
    try:
        await vectorstore.aadd_documents(documents=documents)
        logger.info(f"✅ Berhasil upsert file_id: {file_id}")
    except Exception as e:
        logger.error(f"❌ Gagal saat menambahkan dokumen ke Chroma: {str(e)}")
        raise e
