from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.models import get_db
from app.repositories._subscription_credit_repository import SubscriptionCreditRepository
from app.services.subscription_credit_service import SubscriptionCreditService

def _get_credit_repository(
    db: Session = Depends(get_db),
) -> SubscriptionCreditRepository:
    return SubscriptionCreditRepository(db)

def get_credit_service(
    repo: SubscriptionCreditRepository = Depends(_get_credit_repository),
) -> SubscriptionCreditService:
    return SubscriptionCreditService(repo)
