# app/ai/agents/scoring_agent.py
from langchain_core.prompts import ChatPromptTemplate
from app.utils.llm import llm

from langchain_core.output_parsers import JsonOutputParser
import logging

logger = logging.getLogger(__name__)


PROMPT_TEMPLATE = """
Anda adalah HR AI yang bertugas mengevaluasi CV kandidat secara objektif berdasarkan kriteria yang diberikan. 
Lakukan penilaian dalam tiga aspek utama dengan rentang nilai 0-100:
- Hard Skill
- Experience
- Presentation Quality

Kemudian hitung skor keseluruhan (0-100) sebagai ringkasan performa, dan tentukan apakah kandidat memenuhi standar minimum.

Kaidah penting:
- Hard Skill tidak harus identik dengan kriteria, namun tetap dinilai objektif sesuai kekuatan teknis yang ada.
- Jika kandidat menunjukkan skill signifikan di luar kriteria, tetap beri bobot positif.
- Penilaian harus ringkas, objektif, dan informatif, sebagai pendukung HR (bukan pengganti keputusan akhir).

Tambahkan juga identifikasi teks spesifik dari CV:
- Hard skill penting → highlight kuning
- Pengalaman kerja relevan → highlight hijau
- Teks klise/ambigu/kurang profesional → highlight merah

Catatan:
- Gunakan teks asli persis dari CV (jangan parafrase).
- Output wajib dalam format JSON valid.
- Tidak boleh ada komentar/penjelasan tambahan di luar JSON.
- Semua string harus di-escape dengan benar (\\n untuk baris baru, \\\" untuk tanda kutip).
- Struktur JSON harus mengikuti format berikut:

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
    # Dalam Tahap pengembangan
    retriever = vector_db.as_retriever(
        search_kwargs={
            "k": 10,
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
        "Fokus pada tiga aspek utama: pengalaman kerja (relevansi, durasi, pencapaian), kemampuan teknis atau hard skills (kedalaman dan relevansi skill), serta kualitas penyajian CV (kejelasan kalimat, struktur, dan profesionalitas bahasa). Berikan analisis yang objektif, rinci, dan detail namun tetap ringkas serta efisien untuk membantu HR dalam pengambilan keputusan."
    )
    # END Dalam Tahap pengembangan
    context_str = "\n\n".join([doc.page_content for doc in relevant_context])
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    chain = prompt | llm | JsonOutputParser()

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
