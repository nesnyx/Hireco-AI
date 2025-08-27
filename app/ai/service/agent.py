# app/ai/agents/scoring_agent.py
from langchain_core.prompts import ChatPromptTemplate
from app.utils.llm import llm
from langchain_core.output_parsers import JsonOutputParser
from typing import Dict
import logging

logger = logging.getLogger(__name__)

# Prompt template untuk scoring CV
PROMPT_TEMPLATE = """
Anda adalah HR AI yang bertugas mengevaluasi CV kandidat berdasarkan kriteria yang diberikan. 
Lakukan penilaian objektif dalam tiga aspek utama: 
- Hard Skill (0-100)
- Experience (0-100)
- Presentation Quality (0-100)

Setelah itu, hitung skor keseluruhan (0 - 100) sebagai ringkasan performa umum, 
dan tentukan apakah kandidat memenuhi standar minimum. 

Berikan penjelasan yang ringkas namun tetap objektif dan informatif, 
sehingga dapat membantu HR dalam pertimbangan keputusan. 
Tambahkan catatan bahwa hasil ini adalah analisis AI sebagai pendukung, 
bukan pengganti penilaian akhir HR.

terkait HARD SKILL tidak selalu terikat dengan CRITERIA yang diinginkan, TETAP NILAI SECARA OBJEKTIF
JIKA MEMILIKI HARD SKILL ATAU PENGUASAAN SKILL YANG CUKUP BISA DIJADIKAN ACUAN DALAM PENILAIAN

Selain itu, identifikasi:
- Teks yang menunjukkan **hard skill penting** (harus di-highlight kuning)
- Teks yang menunjukkan **pengalaman kerja relevan** (harus di-highlight hijau)
- Teks yang **kurang profesional, klise, atau ambigu** (harus di-highlight merah)

Gunakan **teks persis seperti muncul di CV**, jangan parafrase.

Berikan output JSON:
{{
  "hard_skill": {{"score": int, "feedback": "str", "highlight": [teks_penting]}},
  "experience": {{"score": int, "feedback": "str", "highlight": [teks_penting]}},
  "presentation_quality": {{"score": int, "issues": ["str"], "highlight_negative": [teks_buruk]}},
  "overall_score": float,
  "explanation": "str",
  "meets_minimum": bool
}}



CV:
{cv_text}

Kriteria:
{criteria}

"""


async def analyze_cv_with_criteria(
    job_id, vector_db, criteria, type, source, telp, file_id
):
    retriever = vector_db.as_retriever(
        search_kwargs={
            "k": 3,
            "filter": {
                "$and": [
                    {"file_id": {"$eq": file_id}},
                    {"job_id": {"$eq": job_id}},
                    {"type": {"$eq": type}},
                    {"source": {"$eq": source}},
                    {"telp": {"$eq": telp}},
                ]
            },
        }
    )
    relevant_context = retriever.invoke(
        "Fokus pada aspek pengalaman kerja, kemampuan teknis (hard skills), dan kualitas penyajian CV, termasuk kejelasan kalimat dan penggunaan bahasa yang profesional."
    )
    context_str = "\n\n".join([doc.page_content for doc in relevant_context])
    parser = JsonOutputParser()
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    chain = prompt | llm | parser

    try:
        result = await chain.ainvoke({"cv_text": context_str, "criteria": criteria})

        # 🔽 Ambil teks untuk highlight
        positive_highlights = []
        negative_highlights = []

        # Dari hard_skill
        if "hard_skill" in result and "highlight" in result["hard_skill"]:
            positive_highlights.extend(result["hard_skill"]["highlight"])

        # Dari experience
        if "experience" in result and "highlight" in result["experience"]:
            positive_highlights.extend(result["experience"]["highlight"])

        # Dari presentation_quality (yang perlu diperbaiki)
        if "presentation_quality" in result:
            if "highlight_negative" in result["presentation_quality"]:
                negative_highlights.extend(
                    result["presentation_quality"]["highlight_negative"]
                )
            if (
                "issues" in result["presentation_quality"]
            ):  # fallback: jika highlight_negative kosong
                # Tapi ini teks feedback, bukan teks asli → tidak bisa di-highlight
                pass

        # Simpan untuk digunakan di loader_pdf
        result["highlights"] = {
            "positive": list(set(positive_highlights)),  # hilangkan duplikat
            "negative": list(set(negative_highlights)),
        }

        return result

    except Exception as e:
        logger.error(f"AI Agent failed: {e}")
        return {
            "hard_skill": {"score": 0, "feedback": ""},
            "experience": {"score": 0, "feedback": ""},
            "presentation_quality": {
                "score": 0,
                "issues": [],
                "highlight_negative": [],
            },
            "overall_score": 0,
            "explanation": "Gagal menganalisis CV. Terjadi kesalahan pada AI.",
            "meets_minimum": False,
            "highlights": {"positive": [], "negative": []},
        }
