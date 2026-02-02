from pydantic import BaseModel
from enum import Enum
class CreatePricingSchema(BaseModel):
    name: str
    price: float
    max_jobs: int
    expires_in_days: int
    
    
class PricingType(Enum):
    Free = "Free"
    Standard = "Standard"
    Pro = "Pro"
