from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
from app.api.container import get_pricing_service
from app.models.models import get_db, Pricing
from sqlalchemy.orm import Session
import logging
from pydantic import BaseModel

from app.services.pricing_service import PricingService

logger = logging.getLogger(__name__)

pricing_router = APIRouter(prefix="/pricing")


class PricingInput(BaseModel):
    name: str
    price: float
    max_jobs: int
    expires_in_days: int

@pricing_router.get("")
async def get_pricing(
    service : PricingService = Depends(get_pricing_service)
):
    return service.find()


@pricing_router.post("/create")
async def create_pricing(
    payload: PricingInput,
    db: Session = Depends(get_db),
):
    existing_pricing = db.query(Pricing).filter(Pricing.name == payload.name).first()
    if existing_pricing:
        raise HTTPException(status_code=400, detail="Pricing plan already exists")
    new_pricing = Pricing(
        name=payload.name,
        price_per_month=payload.price,
        max_jobs=payload.max_jobs,
        expires_in_days=payload.expires_in_days,
    )
    db.add(new_pricing)
    db.commit()
    db.refresh(new_pricing)
    return {
        "id": new_pricing.id,
        "name": new_pricing.name,
        "price_per_month": new_pricing.price_per_month,
        "max_jobs": new_pricing.max_jobs,
        "expires_in_days": new_pricing.expires_in_days,
    }


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
