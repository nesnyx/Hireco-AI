from app.helper.error_handling import PricingAlreadyExists, PricingNotFound
from app.repositories._pricing_repository import PricingRepository
from app.schemas.pricing_schema import CreatePricingSchema


class PricingService:
    def __init__(self,pricing_repo : PricingRepository):
        self._pricing_repo = pricing_repo
    def add_pricing(self, payload : CreatePricingSchema):
        return self._pricing_repo.save(payload=payload)
    
    def find(self):
        return self._pricing_repo.get()
    
    def find_by_id(self, id : str):
        existing_pricing = self._pricing_repo.get_by_id(id=id)
        if not existing_pricing:
            raise PricingNotFound()
        return existing_pricing
    
    def find_by_name(self, name: str):
        existing_pricing = self._pricing_repo.get_by_name(name)
        if existing_pricing:
            raise PricingAlreadyExists()
        return existing_pricing