from pydantic import BaseModel
from enum import Enum
class CreatePricingSchema(BaseModel):
    name: str
    price: float
    max_jobs: int
    expires_in_days: int
    
    
class Pricingtype(Enum):
    Free = "Free"
    Standard = "Standard"
    Pro = "Pro"
