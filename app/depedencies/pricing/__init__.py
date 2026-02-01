from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.models import get_db
from app.repositories._pricing_repository import PricingRepository
from app.services.pricing_service import PricingService

def _get_pricing_repository(
    db: Session = Depends(get_db),
) -> PricingRepository:
    return PricingRepository(db)

def get_pricing_service(
    repo: PricingRepository = Depends(_get_pricing_repository),
) -> PricingService:
    return PricingService(pricing_repo=repo)
