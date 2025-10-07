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
from app.ai.service.models import Job, save_cv_analysis_result
from app.ai.service.splitter import loader_pdf
from pydantic import BaseModel
from app.ai.service.models import get_db, CVAnalysis, Job
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
    highlighted_path = UPLOAD_DIR / f"{file_id}_highlighted.pdf"
    try:

        with open(file_path, "wb") as f:
            f.write(await file.read())
        file_saved = True
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

        if result.get("highlighted_pdf"):
            highlighted_created = True

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

        # Hapus file highlighted jika sudah dibuat
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

        # Re-raise error
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@applicant_router.get("/get-by-job/{job_id}")
async def get_by_job(
    job_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)
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
            .join(Job)  # Join CVAnalysis dengan Job
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
