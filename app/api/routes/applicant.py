from typing import List
import uuid, logging
from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from pathlib import Path
from app.models.models import Job, save_cv_analysis_result
from app.ai.service.splitter import loader_pdf
from pydantic import BaseModel
from app.models.models import get_db, CVAnalysis, Job
from app.utils.jwt import get_current_user
from app.ai.chromadb.vectoredb import delete_applicant_vectordb, check_applicant_exists

logger = logging.getLogger(__name__)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
applicant_router = APIRouter(prefix="/applicant")


class ApplicantInput(BaseModel):
    name: str = Form(...)
    email: str = Form(...)
    telp: str = Form(...)
    job_id: int = Form(...)


@applicant_router.get("/test")
async def testing():
    return {"msg": "testing"}


@applicant_router.post("/upload")
async def upload_cv(
    name: str = Form(...),
    email: str = Form(...),
    telp: str = Form(...),
    job_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    
    jobs = db.query(Job).filter(Job.id == job_id).first()
    if not jobs:
        raise HTTPException(status_code=400, detail=f"Not exist job by id {job_id}")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}.pdf"
    try:

        with open(file_path, "wb") as f:
            f.write(await file.read())
        result = await loader_pdf(
            name=name,
            job_id=job_id,
            file_id=file_id,
            email=email,
            telp=telp,
            file_path=str(file_path),
            file_name=file.filename,
            criteria=jobs.criteria,
        )

        save_cv_analysis_result(
            name=name,
            email=email,
            telp=telp,
            job_id=int(job_id),
            file_id=file_id,
            filename=str(file_path),
            score=result["overall_score"],
            explanation=result["explanation"],
            experience=result["experience"],
            presentation_quality=result["presentation_quality"],
            hard_skill=result["hard_skill"],
            metadata=result.get("metadata", {}),
        )

        # --- 4. Return success ---
        return {
            "name": name,
            "email": email,
            "telp": telp,
            "file_id": file_id,
            "filename": file.filename,
            "score": result["overall_score"],
            "explanation": result["explanation"],
            "experience": result["experience"],
            "presentation_quality": result["presentation_quality"],
            "hard_skill": result["hard_skill"],
        }

    except Exception as e:
        print(f"Error: {e}")
        # --- 🔥 CLEANUP: hapus semua file terkait jika error ---
        # Hapus file asli
        if file_path.exists():
            try:
                file_path.unlink()
                logger.info(f"✅ Deleted original PDF after error: {file_path}")
            except Exception as err:
                logger.error(f"❌ Failed to delete original PDF {file_path}: {err}")

        

        # Re-raise error
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@applicant_router.get("/get-by-job/{job_id}")
async def get_by_job(
    job_id: int, _=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        applicant = db.query(CVAnalysis).filter(CVAnalysis.job_id == job_id).first()
        if not applicant:
            raise HTTPException(
                status_code=400, detail=f"Not exist applicant by id {job_id}"
            )
        return {"data": applicant}
    except Exception as e:
        logger.error(f"DB Error: {e}")
        raise HTTPException(
            status_code=400, detail=f"Something wrong get applicant by id {job_id}"
        )


@applicant_router.get("/get-by-hr")
async def get_by_hr(
    current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        
        applicant = (
            db.query(CVAnalysis)
            .join(Job)  
            .filter(Job.account_id == current_user["id"])
            .all()
        )
        return {"data": applicant}
    except Exception as e:
        logger.error(f"DB Error: {e}")
        raise HTTPException(
            status_code=500, detail="Something went wrong getting applicant"
        )


@applicant_router.delete("/delete/{id}")
async def delete_applicant(id: int, db: Session = Depends(get_db)):
    try:
        applicant = db.query(CVAnalysis).filter(CVAnalysis.id == id).first()
        file_path = UPLOAD_DIR / f"{applicant.file_id}.pdf"
        highlighted_path = UPLOAD_DIR / f"{applicant.file_id}_highlighted.pdf"
        if not applicant:
            return {"message": "Applicant not found or not owned by user"}
        db.delete(applicant)
        db.commit()
        delete_applicant_vectordb(file_id=applicant.file_id)

        # Hapus file PDF
        if file_path.exists():
            try:
                file_path.unlink()
                logger.info(f"✅ Deleted original PDF after error: {file_path}")
            except Exception as err:
                logger.error(f"❌ Failed to delete original PDF {file_path}: {err}")

        # Hapus file highlighted
        if highlighted_path.exists():
            try:
                highlighted_path.unlink()
                logger.info(
                    f"✅ Deleted highlighted PDF after error: {highlighted_path}"
                )
            except Exception as err:
                logger.error(
                    f"❌ Failed to delete highlighted PDF {highlighted_path}: {err}"
                )
        return {"message": "Applicant deleted successfully"}
    except Exception as e:
        logger.error(f"DB Error: {e}")
        raise HTTPException(
            status_code=500, detail="Something went wrong getting applicant"
        )


@applicant_router.get("/vectordb/check/{file_id}")
async def check_file(file_id: str):
    try:
        data = check_applicant_exists(file_id=file_id)
        return data

    except Exception as e:
        logger.error(f"DB Error: {e}")
        raise HTTPException(
            status_code=500, detail="Something went wrong getting applicant"
        )


# --- BATASAN UNTUK VALIDASI ---
MAX_FILES = 5
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
TOTAL_MAX_SIZE_BYTES = MAX_FILES * MAX_FILE_SIZE_BYTES


@applicant_router.post("/upload/batch")
async def upload_cv_batch(
    job_id: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    """
    Endpoint untuk mengunggah beberapa file CV (PDF) sekaligus (batch).
    Validasi yang dilakukan:
    1. Jumlah file tidak lebih dari MAX_FILES.
    2. Setiap file harus berformat .pdf.
    3. Ukuran setiap file tidak boleh melebihi MAX_FILE_SIZE_BYTES.
    4. Total ukuran gabungan semua file tidak boleh melebihi TOTAL_MAX_SIZE_BYTES.
    """

    # --- 1. Validasi Input Awal ---
    if not db.query(Job).filter(Job.id == job_id).first():
        raise HTTPException(
            status_code=404, detail=f"Pekerjaan dengan ID {job_id} tidak ditemukan."
        )

    # Validasi jumlah file
    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=413,  # Payload Too Large
            detail=f"Terlalu banyak file. Maksimal {MAX_FILES} file diperbolehkan.",
        )

    # --- 2. Validasi Setiap File (Tipe & Ukuran) ---
    total_size = 0
    for file in files:
        # Validasi ekstensi file
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,  # Bad Request
                detail=f"File tidak valid: '{file.filename}'. Hanya file PDF yang diperbolehkan.",
            )

        # Validasi ukuran per file (cara efisien tanpa membaca seluruh file ke memori)
        file.file.seek(0, 2)  # Pindah cursor ke akhir file
        file_size = file.file.tell()  # Dapatkan posisi cursor (ukuran file dalam bytes)
        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Ukuran file '{file.filename}' terlalu besar. Maksimal {MAX_FILE_SIZE_MB} MB per file.",
            )
        total_size += file_size
        await file.seek(0)  # PENTING: Kembalikan cursor ke awal untuk dibaca nanti

    # Validasi total ukuran
    if total_size > TOTAL_MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Total ukuran semua file melebihi batas. Maksimal {TOTAL_MAX_SIZE_BYTES / (1024*1024)} MB.",
        )

    # --- 3. Proses Setiap File ---
    processed_results = []
    saved_file_paths = (
        []
    )  # Untuk melacak file yang berhasil disimpan, untuk cleanup jika gagal

    try:
        job = db.query(Job).filter(Job.id == job_id).first()

        for file in files:
            file_id = str(uuid.uuid4())
            file_path = UPLOAD_DIR / f"{file_id}.pdf"

            # Simpan file ke disk
            try:
                with open(file_path, "wb") as f:
                    content = await file.read()
                    f.write(content)
                saved_file_paths.append(file_path)
            except Exception as e:
                logger.error(f"Gagal menyimpan file {file.filename}: {e}")
                raise HTTPException(
                    status_code=500, detail=f"Gagal menyimpan file {file.filename}"
                )

            # **ASUMSI**: Fungsi `loader_pdf` Anda dapat mengekstrak info pelamar dari PDF.
            # Jika tidak, Anda perlu menyesuaikan bagaimana `name`, `email`, `telp` didapatkan.
            result = await loader_pdf(
                job_id=job_id,
                file_id=file_id,
                file_path=str(file_path),
                file_name=file.filename,
                criteria=job.criteria,
                # name, email, telp diasumsikan didapat dari dalam PDF
            )

            # Ekstrak info pelamar dari hasil analisis
            applicant_name = result.get("metadata", {}).get("name", "N/A")
            applicant_email = result.get("metadata", {}).get("email", "N/A")
            applicant_telp = result.get("metadata", {}).get("phone", "N/A")

            save_cv_analysis_result(
                db=db,  # Pastikan fungsi ini menerima `db` atau sesuaikan
                name=applicant_name,
                email=applicant_email,
                telp=applicant_telp,
                job_id=job_id,
                file_id=file_id,
                filename=str(file_path),
                score=result["overall_score"],
                explanation=result["explanation"],
                experience=result["experience"],
                presentation_quality=result["presentation_quality"],
                hard_skill=result["hard_skill"],
                metadata=result.get("metadata", {}),
            )

            # Tambahkan hasil ke list untuk respons
            processed_results.append(
                {
                    "file_id": file_id,
                    "filename": file.filename,
                    "score": result["overall_score"],
                    "name": applicant_name,
                    "email": applicant_email,
                    "status": "success",
                }
            )

        return {
            "message": f"{len(files)} file berhasil diproses.",
            "results": processed_results,
        }

    except Exception as e:
        logger.error(f"Terjadi error saat pemrosesan batch: {e}", exc_info=True)
        # --- 🔥 CLEANUP: Hapus semua file yang sudah tersimpan jika ada error ---
        for path in saved_file_paths:
            if path.exists():
                try:
                    path.unlink()
                    logger.info(f"✅ Berhasil menghapus file setelah error: {path}")
                except Exception as err:
                    logger.error(f"❌ Gagal menghapus file {path}: {err}")

        raise HTTPException(status_code=500, detail=f"Pemrosesan batch gagal: {str(e)}")
