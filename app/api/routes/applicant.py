from typing import List
import logging
from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
    UploadFile,
    File,
    Form,
)
from pathlib import Path
from app.depedencies.applicant import get_applicant_service
from pydantic import BaseModel
from app.services.applicant_service import ApplicantService


logger = logging.getLogger(__name__)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
applicant_router = APIRouter(prefix="/applicant")

MAX_FILES = 5
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
TOTAL_MAX_SIZE_BYTES = MAX_FILES * MAX_FILE_SIZE_BYTES


class ApplicantInput(BaseModel):
    name: str = Form(...)
    email: str = Form(...)
    telp: str = Form(...)
    job_id: int = Form(...)




@applicant_router.post("/upload")
async def upload_cv(
    job_id: str = Form(...),
    file: UploadFile = File(...),
    service : ApplicantService = Depends(get_applicant_service)
):
    return await service.analyze(job_id=job_id,file=file)



@applicant_router.post("/upload/batch")
async def upload_cv_batch(
    job_id: str = Form(...),
    files: List[UploadFile] = File(...),
    service : ApplicantService = Depends(get_applicant_service)
):
   

    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=413,  # Payload Too Large
            detail=f"Terlalu banyak file. Maksimal {MAX_FILES} file diperbolehkan.",
        )


    total_size = 0
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"File tidak valid: '{file.filename}'. Hanya file PDF yang diperbolehkan.",
            )
        file.file.seek(0, 2)  
        file_size = file.file.tell()  
        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Ukuran file '{file.filename}' terlalu besar. Maksimal {MAX_FILE_SIZE_MB} MB per file.",
            )
        total_size += file_size
        await file.seek(0)  

    if total_size > TOTAL_MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Total ukuran semua file melebihi batas. Maksimal {TOTAL_MAX_SIZE_BYTES / (1024*1024)} MB.",
        )
    return await service.analyze_batch(job_id=job_id,files=files)
    