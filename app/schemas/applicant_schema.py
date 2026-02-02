from pydantic import BaseModel
from typing import Any
class CreateApplicantSchema(BaseModel):
    file_id : str
    name : str 
    email:str 
    telp : str
    filename : str
    score:float
    job_id : str
    explanation : Any
    hard_skill : Any
    experience : Any
    presentation_quality: Any
    

    
    
class LoaderPDFSchema(BaseModel):
    job_id : str 
    name : str 
    email:str 
    telp : str
    file_path:str
    file_name:str
    criteria :str
    file_id:str