from app.helper.error_handling import RoleNotFound, UserNotFound
from app.repositories._role_repository import RoleName
from app.repositories._user_repository import UserRepository
from app.schemas.pricing_schema import PricingType
from app.schemas.user_schema import CreateUserSchema
from app.services.pricing_service import PricingService
from app.services.role_service import RoleService
from app.services.subscription_credit_service import SubscriptionCreditService
from app.services.user_subscription_service import UserSubscriptionService


class UserService:
    def __init__(self, user_repository : UserRepository, role_service : RoleService,user_subscription_service: UserSubscriptionService,pricing_service : PricingService, credit_service : SubscriptionCreditService):
        self._user_repository = user_repository
        self._role_service = role_service
        self._user_subscription_service = user_subscription_service
        self._pricing_service = pricing_service
        self._credit_service = credit_service
        
    def create_user(self, payload : CreateUserSchema):
        try:
            new_user = self._user_repository.save(payload)
            existing_role = self._role_service.get_role_by_name(RoleName.USER.value)
            if not existing_role:
                raise RoleNotFound()
            self._role_service.assign_role_to_user(
                account_id=new_user.id,
                role_id=existing_role.id
            )
            free_pricing = self._pricing_service.find_by_name(PricingType.Free.value)
            subscription = self._user_subscription_service.assign_subscription_to_user(
                account_id=new_user.id,
                pricing_id=free_pricing.id
            )
            self._credit_service.create(subscription.id)
            self._user_repository._db.commit()
            self._user_repository._db.refresh(new_user)
            return new_user
        except Exception as e:
            self._user_repository._db.rollback()
            raise e

    def find_by_email(self, email :str):
        existing_user = self._user_repository.get_by_email(email)
        if not existing_user:
            raise UserNotFound()
        return existing_user
    
    def find_by_id(self, id : str):
        existing_user = self._user_repository.get_by_id(id)
        if not existing_user:
            raise UserNotFound()
        return existing_user
    
    def update_status(self,account_id : str):
        return self._user_repository.update_status(account_id)