import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.ai.chromadb.vectoredb import upsert_applicant_to_vectordb, vectorstore
from app.ai.service.agent import analyze_cv_with_criteria
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)


async def loader_pdf(
    job_id, name, email, telp, file_path, file_name, criteria, file_id
):
    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
    except Exception as e:
        logger.error(f"Failed to load PDF {file_path}: {e}")
        raise ValueError("Invalid PDF file")

    logger.info(f"Loaded {len(docs)} PDF documents.")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=30, separators=["\n\n", "\n", ".", " "]
    )
    split_texts = text_splitter.split_documents(docs)
    metadatas = {
        "job_id": job_id,
        "file_id": file_id,
        "name": name,
        "email": email,
        "telp": telp,
        "source": file_path,
        "file_name": file_name,
        "type": "cv",
    }
    for doc in split_texts:
        doc.metadata.update(metadatas)

    logger.info(f"Split into {len(split_texts)} chunks of text.")
    # vectorstore.add_documents(documents=split_texts)
    
    # ✅ Gunakan fungsi upsert yang aman
    upsert_applicant_to_vectordb(
        documents=split_texts, file_id=file_id, vectorstore=vectorstore
    )
    result = await analyze_cv_with_criteria(
        job_id=job_id,
        vector_db=vectorstore,
        file_id=file_id,
        criteria=criteria,
        type="cv",
        source=file_path,
        telp=telp,
    )
    highlights = result.get("highlights", {"positive": [], "negative": []})
    if highlights["positive"] or highlights["negative"]:
        highlighted_path = file_path.replace(".pdf", "_highlighted.pdf")
       
        result["highlightead_pdf"] = f"/downloads/{os.path.basename(highlighted_path)}"
    else:
        result["highlighted_pdf"] = None

    return result


    
