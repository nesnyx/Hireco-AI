from app.repositories._user_subscription_repository import UserSubscriptionRepository


class UserSubscriptionService:
    def __init__(self,user_subscription_repository : UserSubscriptionRepository):
        self._user_subscription_repository = user_subscription_repository