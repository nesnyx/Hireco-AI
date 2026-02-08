from pydantic import BaseModel
from typing import Optional, Any

class CreateApplicantSchema(BaseModel):
    file_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    telp: Optional[str] = None
    filename: Optional[str] = None
    score: Optional[float] = None
    job_id: Optional[str] = None
    account_id:str
    explanation: Optional[Any] = None
    hard_skill: Optional[Any] = None
    experience: Optional[Any] = None
    presentation_quality: Optional[Any] = None


    
    
class LoaderPDFSchema(BaseModel):
    job_id : str 
    name : str 
    email:str 
    telp : str
    file_path:str
    file_name:str
    criteria :str
    file_id:str