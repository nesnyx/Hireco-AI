from sqlalchemy.orm import Session

from app.models.models import CVAnalysis
from app.schemas.applicant_schema import CreateApplicantSchema

class ApplicantRepository:
    def __init__(self,db_session : Session):
        self._db_session  = db_session
        
    def save_bulk(self,data : list[dict]):
        try:
            self._db_session.bulk_insert_mappings(CVAnalysis,data)
            self._db_session.commit()
        except Exception:
            self._db_session.rollback()
            raise
        
    def save(self,payload : CreateApplicantSchema):
        new_applicant = CVAnalysis(
            file_id = payload.file_id,
            name = payload.name,
            email = payload.email,
            telp = payload.telp,
            filename = payload.filename,
            score = payload.score,
            job_id = payload.job_id,
            explanation = payload.explanation,
            hard_skill = payload.hard_skill,
            experience = payload.experience,
            presentation_quality = payload.presentation_quality,
        )
        self._db_session.add(new_applicant)
        self._db_session.commit()
        self._db_session.refresh(new_applicant)
        return new_applicant