from fastapi import Depends
from sqlalchemy.orm import Session
from app.depedencies.hr import get_hr_service
from app.models.models import get_db
from app.repositories._applicant_repository import ApplicantRepository
from app.services.applicant_service import ApplicantService
from app.services.hr_service import HrService


def _get_applicant_repository(
    db: Session = Depends(get_db),
) -> ApplicantRepository:
    return ApplicantRepository(db)

def get_applicant_service(
    repo: ApplicantRepository = Depends(_get_applicant_repository),hr_service : HrService = Depends(get_hr_service)
) -> ApplicantService:
    return ApplicantService(repo,hr_service)
