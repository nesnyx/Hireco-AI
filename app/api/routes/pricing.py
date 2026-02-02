from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)

from app.depedencies.pricing import get_pricing_service
from app.models.models import get_db, Pricing
from sqlalchemy.orm import Session
import logging
from app.schemas.pricing_schema import CreatePricingSchema
from app.services.pricing_service import PricingService

logger = logging.getLogger(__name__)

pricing_router = APIRouter(prefix="/pricing")


@pricing_router.get("")
async def get_pricing(
    service : PricingService = Depends(get_pricing_service)
):
    return service.find()


@pricing_router.post("")
async def create_pricing(
    payload: CreatePricingSchema,
    service: PricingService = Depends(get_pricing_service),
):
    return service.add_pricing(payload)


@pricing_router.delete("/{pricing_id}")
async def delete_pricing(pricing_id: int, db: Session = Depends(get_db)):
    pricing = db.query(Pricing).filter(Pricing.id == pricing_id).first()
    if not pricing:
        raise HTTPException(status_code=404, detail="Pricing plan not found")
    db.delete(pricing)
    db.commit()
    return {"detail": "Pricing plan deleted"}


@pricing_router.put("/{pricing_id}")
async def update_pricing(
    pricing_id: int,
    name: str = None,
    price: float = None,
    features: str = None,
    db: Session = Depends(get_db),
):
    pricing = db.query(Pricing).filter(Pricing.id == pricing_id).first()
    if not pricing:
        raise HTTPException(status_code=404, detail="Pricing plan not found")
    if name:
        pricing.name = name
    if price:
        pricing.price = price
    if features:
        pricing.features = features
    db.commit()
    db.refresh(pricing)
    return pricing


