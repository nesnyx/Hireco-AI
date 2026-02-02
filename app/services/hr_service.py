from app.repositories._hr_repository import HrRepository
from app.schemas.job_schema import CreateJobSchema, UpdateJobSchema


class HrService:
    def __init__(self,hr_repository : HrRepository):
        self._hr_repository = hr_repository
    
    
    def create(self, payload : CreateJobSchema):pass
    
    def update(self, payload:UpdateJobSchema):pass
    def find_by_account_id(self, id : str):pass