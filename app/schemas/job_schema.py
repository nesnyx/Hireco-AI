from pydantic import BaseModel

class CreateJobSchema(BaseModel):
    title: str
    position: str
    description: str
    criteria: str
    
class UpdateJobSchema(CreateJobSchema):
    pass