from app.repositories._hr_repository import HrRepository
from app.schemas.job_schema import CreateJobSchema, UpdateJobSchema


class HrService:
    def __init__(self,hr_repository : HrRepository):
        self._hr_repository = hr_repository
    
    
    def create(self, payload : CreateJobSchema,account_id : str):
        return self._hr_repository.save_job(payload=payload,account_id=account_id)
    
    def update(self, payload:UpdateJobSchema,id:str,account_id:str):
        return self._hr_repository.update_job(payload,id,account_id)
    def find_by_account_id(self, id : str):
        return self._hr_repository.get_by_account_id(id)
    
    def find_by_id(self, id : str):
        return self._hr_repository.get_by_id(id)
    
    def delete(self, id : str):
        return self._hr_repository.delete_job(id)