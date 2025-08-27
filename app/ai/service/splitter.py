import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.ai.chromadb.vectoredb import vectorstore
from app.ai.service.agent import analyze_cv_with_criteria
import logging, fitz
import rapidfuzz as fuzz
from typing import List, Dict

logger = logging.getLogger(__name__)


async def loader_pdf(job_id, name, email, telp, file_path, file_name, criteria,file_id):
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    logger.info(f"Loaded {len(docs)} PDF documents.")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=50, separators=["\n\n", "\n", ".", " "]
    )
    split_texts = text_splitter.split_documents(docs)
    metadatas = {
        "job_id": job_id,
        "file_id":file_id,
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

    vectorstore.add_documents(documents=split_texts)

    result = await analyze_cv_with_criteria(
        job_id=job_id,
        vector_db=vectorstore,
        file_id=file_id,
        criteria=criteria,
        type="cv",
        source=file_path,
        telp=telp,
    )

    # ✨ Ambil teks yang sudah digunakan di analisis → highlight
    # Ambil highlights dari hasil


    highlights = result.get("highlights", {"positive": [], "negative": []})

    if highlights["positive"] or highlights["negative"]:
        highlighted_path = file_path.replace(".pdf", "_highlighted.pdf")
        add_highlights_simple(file_path, highlighted_path, highlights)
        result["highlighted_pdf"] = f"/downloads/{os.path.basename(highlighted_path)}"
    else:
        result["highlighted_pdf"] = None

    return result


def add_highlights_simple(
    input_pdf: str, output_pdf: str, highlights: Dict[str, List[str]]
):
    """
    highlights = {
        "positive": ["Python", "mengembangkan API"],
        "negative": ["bisa kerja keras", "suka tantangan"]
    }
    """
    doc = fitz.open(input_pdf)

    for page in doc:
        # 🟨 Highlight positif: kuning
        for text in highlights.get("positive", []):
            if not text or not text.strip():
                continue
            instances = page.search_for(text)
            for inst in instances:
                annot = page.add_highlight_annot(inst)
                annot.set_colors(stroke=(1, 1, 0))  # kuning
                annot.update()

        # 🟥 Highlight negatif: merah
        for text in highlights.get("negative", []):
            if not text or not text.strip():
                continue
            instances = page.search_for(text)
            for inst in instances:
                annot = page.add_highlight_annot(inst)
                annot.set_colors(stroke=(1, 0, 0))  # merah
                annot.update()

    doc.save(output_pdf)
    doc.close()
