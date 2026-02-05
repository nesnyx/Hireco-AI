from fastapi import Depends
from sqlalchemy.orm import Session
from app.depedencies.pricing import get_pricing_service
from app.depedencies.role import get_role_service
from app.depedencies.subscription import get_credit_service
from app.models.models import get_db
from app.repositories._user_repository import UserRepository
from app.repositories._user_subscription_repository import UserSubscriptionRepository
from app.services.auth_service import AuthService
from app.services.pricing_service import PricingService
from app.services.role_service import RoleService
from app.services.subscription_credit_service import SubscriptionCreditService
from app.services.user_service import UserService
from app.services.user_subscription_service import UserSubscriptionService


def _get_user_repository(db: Session = Depends(get_db)) ->UserRepository:
    return UserRepository(db)

def _get_user_subscription_repository(db: Session = Depends(get_db)) -> UserSubscriptionRepository:
    return UserSubscriptionRepository(db)

def _get_user_subscription_service(repo : UserSubscriptionRepository = Depends(_get_user_subscription_repository)) -> UserSubscriptionService:
    return UserSubscriptionService(repo)

def _get_user_service(repo :UserRepository = Depends(_get_user_repository),role_service : RoleService = Depends(get_role_service),user_subscription_service : UserSubscriptionService = Depends(_get_user_subscription_service),pricing_service : PricingService = Depends(get_pricing_service),credit_service : SubscriptionCreditService = Depends(get_credit_service)) ->UserService:
    return UserService(repo, role_service,user_subscription_service,pricing_service,credit_service)


def get_auth_service(service : UserService = Depends(_get_user_service),user_subscription_service : UserSubscriptionService = Depends(_get_user_subscription_service)) -> AuthService:
    return AuthService(service,user_subscription_service)