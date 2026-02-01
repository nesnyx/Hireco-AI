from app.repositories._pricing_repository import PricingRepository
from app.schemas.pricing_schema import CreatePricingSchema


class PricingService:
    def __init__(self,pricing_repo : PricingRepository):
        self._pricing_repo = pricing_repo
    def add_pricing(self, payload : CreatePricingSchema):
        return self._pricing_repo.save(payload=payload)
    
    def find(self):
        return self._pricing_repo.get()