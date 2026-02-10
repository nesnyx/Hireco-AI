from fastapi import (
    Depends,
    APIRouter,
)
import logging
from app.depedencies.subscription import get_credit_service
from app.services.subscription_credit_service import SubscriptionCreditService
from app.utils.jwt import get_current_user
logger = logging.getLogger(__name__)
subscription_router = APIRouter(prefix="/subscriptions")



@subscription_router.get("/credit")
async def credit(current_user=Depends(get_current_user),service : SubscriptionCreditService = Depends(get_credit_service)):
    return service.find_by_account_id(current_user['id'])
    