from app.helper.error_handling import CreditDischarge, CreditNotFound
from app.repositories._subscription_credit_repository import SubscriptionCreditRepository


class SubscriptionCreditService:
    def __init__(self,credit_repository : SubscriptionCreditRepository):
        self._credit_repository = credit_repository
        
    def create(self,subscription_id : str):
        return self._credit_repository.create(subscription_id=subscription_id)
    
    def update(self,subscription_id : str ,amount : int):
        existing_credit = self._credit_repository.find_by_subscription_id(subscription_id)
        if not existing_credit:
            raise CreditNotFound()
        if existing_credit.amount == 0:
            raise CreditDischarge()
        updated_amount = amount - 1
        return self._credit_repository.update(subscription_id=subscription_id,amount=updated_amount)
    
    def find_by_subscription_id(self,subscription_id : str):
        return self._credit_repository.find_by_subscription_id(subscription_id)
    
    def find_by_account_id(self, account_id:str):
        return self._credit_repository.find_by_account_id(account_id=account_id)