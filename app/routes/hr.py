from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
    File,
    Path,
)
from pydantic import BaseModel
from app.ai.service.models import CVAnalysis, Job, Accounts, get_db
from sqlalchemy.orm import Session
from app.utils.jwt import get_current_user
import logging, random, string, os
from sqlalchemy import func
from fastapi.responses import FileResponse

logger = logging.getLogger(__name__)
hr_router = APIRouter(prefix="/hr")

UPLOAD_DIR = "uploads"


class CriteriaInput(BaseModel):
    criteria: str
    job_id: int


class JobInput(BaseModel):
    title: str
    position: str
    description: str
    criteria: str


@hr_router.get("/jobs")
async def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return {"data": jobs}


@hr_router.get("/jobs/get-by-hr")
async def get_all_jobs(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    jobs = (
        db.query(
            Job.id,
            Job.title,
            Job.token,
            Job.position,
            Job.description,
            Job.criteria,
            func.count(CVAnalysis.id).label("applicant_count"),
        )
        .outerjoin(CVAnalysis, Job.id == CVAnalysis.job_id)
        .filter(Job.account_id == current_user["id"])
        .group_by(
            Job.id, Job.title, Job.token, Job.position, Job.description, Job.criteria
        )
        .all()
    )

    return {
        "data": [
            {
                "id": item.id,
                "title": item.title,
                "token": item.token,
                "position": item.position,
                "description": item.description,
                "criteria": item.criteria,
                "applicant_count": item.applicant_count,
            }
            for item in jobs
        ]
    }


@hr_router.get("/jobs/{job_id}")
async def get_by_id(
    job_id: int = Path(..., description="Id job yang dicari"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        job = (
            db.query(Job)
            .filter(Job.id == job_id, Job.account_id == current_user["id"])
            .first()
        )
        if not job:
            raise HTTPException(status_code=400, detail=f"Not exist job by id {job_id}")
        return {"data": job}
    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
        raise HTTPException(
            status_code=400, detail=f"Something wrong get job by id {job_id}"
        )


@hr_router.post("/jobs/create")
async def create_job(
    input: JobInput,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_job = Job(
        title=input.title,
        position=input.position,
        criteria=input.criteria,
        description=input.description,
        account_id=current_user["id"],
        token=generate_random_string(),
    )
    try:
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
        return {"message": "Job created", "job": new_job}
    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
        raise HTTPException(status_code=400, detail="Something wrong craete job")


@hr_router.delete("/jobs/{job_id}")
async def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        # cari job dulu
        job = (
            db.query(Job)
            .filter(Job.id == job_id, Job.account_id == current_user["id"])
            .first()
        )

        if not job:
            return {"message": "Job not found or not owned by user"}

        db.delete(job)
        db.commit()
        return {"message": "Job deleted successfully"}

    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
        return {"message": "Failed to delete job"}


@hr_router.put("/jobs/{job_id}")
async def update_job(
    job_id: int,
    job_data: JobInput,  # semua field wajib ada
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        job = (
            db.query(Job)
            .filter(Job.id == job_id, Job.account_id == current_user["id"])
            .first()
        )

        if not job:
            return {"message": "Job not found or not owned by user"}

        job.title = job_data.title
        job.position = job_data.position
        job.description = job_data.description
        job.criteria = job_data.criteria

        db.commit()
        db.refresh(job)

        return {"message": "Job updated successfully", "job": job_data.dict()}

    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
        return {"message": "Failed to update job"}


@hr_router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"uploads/{filename}"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    return {"error": "File not found"}


def generate_random_string(length=10):
    characters = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
    return "".join(random.choices(characters, k=length))
