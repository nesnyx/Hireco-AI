import random
import string
from sqlalchemy.orm import Session
from app.helper.error_handling import UserNotFound
from app.models.models import Job
from app.schemas.job_schema import CreateJobSchema, UpdateJobSchema

class HrRepository:
    def __init__(self,db_session : Session):
        self._db_session = db_session
    
    def _generate_random_string(self,length=10):
        characters = string.ascii_letters + string.digits
        return "".join(random.choices(characters, k=length))

    def get_by_account_id(self,account_id : str):
       return self._db_session.query(Job).filter(Job.account_id == account_id).all()
   
    def get_by_id(self, id : str):
        return self._db_session.get(Job, id)
        
    def save_job(self,payload : CreateJobSchema,account_id : str):
        new_job = Job(
            title=payload.title,
            position = payload.position,
            description = payload.description,
            criteria = payload.criteria,
            account_id = account_id,
            token=self._generate_random_string()
        )
        self._db_session.add(new_job)
        self._db_session.commit()
        self._db_session.refresh(new_job)
        return new_job
    
    def delete_job(self, id : str):
        job = self._db_session.get(Job, id)
        if not job:
            raise UserNotFound()
        self._db_session.delete(job)
        self._db_session.commit()
        return True
        
    
    def update_job(self,payload :UpdateJobSchema ):
        job = self._db_session.get(Job, id)
        if not job:
            raise UserNotFound()
        job.title = payload.title
        job.position = payload.position
        job.description = payload.description
        job.criteria = payload.criteria
        self._db_session.commit()
        self._db_session.refresh(job)
        return job
    
    