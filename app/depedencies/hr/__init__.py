from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.models import get_db
from app.repositories._hr_repository import HrRepository
from app.services.hr_service import HrService


def _get_hr_repository(db : Session = Depends(get_db)) -> HrRepository:
    return HrRepository(db)
    
def get_hr_service(repo : HrService = Depends(_get_hr_repository)) -> HrService:
    return HrService(repo)