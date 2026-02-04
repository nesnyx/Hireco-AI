from app.repositories._subscription_credit_repository import SubscriptionCreditRepository


class SubscriptionCreditService:
    def __init__(self,credit_repository : SubscriptionCreditRepository):
        self._credit_repository = credit_repository
        
    def create(self,subscription_id : str):
        return self._credit_repository.create(subscription_id=subscription_id)