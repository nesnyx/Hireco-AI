from app.helper.error_handling import UserNotFound
from app.repositories._user_subscription_repository import UserSubscriptionRepository


class UserSubscriptionService:
    def __init__(self,user_subscription_repository : UserSubscriptionRepository):
        self._user_subscription_repository = user_subscription_repository
        
        
    def assign_subscription_to_user(self, account_id : str, pricing_id : str):
        return self._user_subscription_repository.assign_subscription_to_user(
            account_id=account_id,
            pricing_id=pricing_id
        )
            
    
    def find_user_subscription(self, account_id : str):        
        existing_subscription = self._user_subscription_repository.get_user_subscription(account_id=account_id)
        if not existing_subscription:
            raise UserNotFound()
        return existing_subscription
    
