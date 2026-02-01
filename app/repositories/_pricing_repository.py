
from sqlalchemy.orm import Session
from app.models.models import Pricing
from app.schemas.pricing_schema import CreatePricingSchema
class PricingRepository:
    def __init__(self,db_session:Session):
        self._db = db_session
    def save(self,payload : CreatePricingSchema):
        new_pricing = Pricing(
            name=payload.name,
            price_per_month=payload.price,
            max_jobs=payload.max_jobs,
            expires_in_days=payload.expires_in_days,
        )
        self._db.add(new_pricing)
        self._db.commit()
        self._db.refresh(new_pricing)
        return new_pricing
    
    def get(self):
        return self._db.query(Pricing).all()
    
    def get_by_id(self, id : str):
        return self._db.query(Pricing).filter(Pricing.id  == id).first()
    
    def get_by_name(self, name : str):
        return self._db.query(Pricing).filter_by(name=name).first()