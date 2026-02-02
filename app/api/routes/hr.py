from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
    File,Body,
    Path,

)
from pydantic import BaseModel
from app.depedencies.hr import get_hr_service
from app.models.models import CVAnalysis, Job, get_db
from sqlalchemy.orm import Session
from app.schemas.job_schema import CreateJobSchema, UpdateJobSchema
from app.services.hr_service import HrService
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
async def get_all_jobs(current_user=Depends(get_current_user),service : HrService = Depends(get_hr_service)):
    return service.find_by_account_id(current_user['id'])



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


@hr_router.post("/jobs")
async def create_job(
    payload : CreateJobSchema,
    current_user=Depends(get_current_user),
    service : HrService = Depends(get_hr_service)
):
    return service.create(payload,current_user["id"])


@hr_router.delete("/jobs/{job_id}")
async def delete_job(
    job_id: str,
    service : HrService = Depends(get_hr_service)
):
   return service.delete(id=job_id)


@hr_router.put("/jobs/{job_id}")
async def update_job(
    job_id: str,
    payload: UpdateJobSchema,  
    service : HrService = Depends(get_hr_service),
    current_user=Depends(get_current_user),
):
    return service.update(payload=payload,account_id=current_user["id"],id=job_id)


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
