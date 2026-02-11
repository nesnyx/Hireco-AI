from pathlib import Path
from sqlalchemy.orm import Session

from app.helper.error_handling import ApplicantNotFound
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
            account_id=payload.account_id,
            hard_skill = payload.hard_skill,
            experience = payload.experience,
            presentation_quality = payload.presentation_quality,
        )
        self._db_session.add(new_applicant)
        self._db_session.commit()
        self._db_session.refresh(new_applicant)
        return new_applicant
    
    def update_status(self,id:str,status:str):
        applicant = self._db_session.query(CVAnalysis).filter(CVAnalysis.id == id).first()
        if not applicant:
            return ApplicantNotFound()
        applicant.status = status
        self._db_session.commit()
        self._db_session.refresh(applicant)
        return applicant
    
    def update(self, id : str,payload : CreateApplicantSchema, status:str):
        applicant = (
        self._db_session
            .query(CVAnalysis)
            .filter(CVAnalysis.file_id == id)
            .first()
        )
        if not applicant:
            return ApplicantNotFound()
        applicant.file_id = payload.file_id
        applicant.name = payload.name
        applicant.email = payload.email
        applicant.telp = payload.telp
        applicant.filename = payload.filename
        applicant.score = payload.score
        applicant.job_id = payload.job_id
        applicant.explanation = payload.explanation
        applicant.hard_skill = payload.hard_skill
        applicant.experience = payload.experience
        applicant.presentation_quality = payload.presentation_quality
        applicant.status = status
        self._db_session.flush()
        return applicant
    
    def get_all(self):
        return self._db_session.query(CVAnalysis).all()
    
    def delete(self,id:str):
        applicant = self._db_session.query(CVAnalysis).filter(CVAnalysis.id == id).first()
        if not applicant:
            return ApplicantNotFound()
        path_to_delete = Path(applicant.filename)
        if path_to_delete.exists():
            path_to_delete.unlink()
        self._db_session.delete(applicant)
        self._db_session.commit()
        return True