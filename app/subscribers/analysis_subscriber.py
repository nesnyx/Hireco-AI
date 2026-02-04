from app.core.events import ee, ANALYSIS_STARTED
from app.models.models import db
from app.repositories._applicant_repository import ApplicantRepository
from app.schemas.applicant_schema import CreateApplicantSchema
import logging

logger = logging.getLogger(__name__)

@ee.on(ANALYSIS_STARTED)
async def handle_pdf_analysis(payload: dict, loader_pdf_func):
    logger.info(f"🚀 Memulai processing untuk file_id: {payload['file_id']}")
    file_id = payload["file_id"]
    file_path = payload["file_path"]
    filename = payload["filename"]
    job_id = payload["job_id"]
    try:
        applicant_repository = ApplicantRepository(db_session=db)
        processed_results = []
        result = await loader_pdf_func(
            job_id=job_id,
            file_path=file_path,
            file_name=filename,
            criteria=payload["criteria"],
            file_id=file_id,
        )
        applicant_name = result.get("name", "N/A")
        applicant_email = result.get("email", "N/A")
        applicant_telp = result.get("phone", "N/A")
        processed_results.append(
                {
                    "file_id": file_id,
                    "filename": filename,
                    "score": result["overall_score"],
                    "name": applicant_name,
                    "email": applicant_email,
                    "status": "success",
                }
            )
        payload = CreateApplicantSchema(
            file_id=file_id,
            name=applicant_name,
            email=applicant_email,
            telp=applicant_telp,
            filename=str(file_path),
            score=result["overall_score"],
            explanation=result["explanation"],
            experience=result["experience"],
            presentation_quality=result["presentation_quality"],
            hard_skill=result["hard_skill"],
            job_id=job_id,
        )
        applicant_repository.update(file_id,payload,"COMPLETED")
        logging.info(f"✅ Selesai processing untuk file_id: {file_id}")
    except Exception as e:
        logging.error(f"❌ Gagal processing untuk file_id: {file_id}. Error: {str(e)}")