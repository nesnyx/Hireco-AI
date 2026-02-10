from sqlalchemy.orm import Session
from sqlalchemy import update, select
from app.models.models import SubscriptionCredit, UserSubscription

class SubscriptionCreditRepository:
    def __init__(self,db_session : Session):
        self._db_session = db_session
    
    def find_by_subscription_id(self,subscription_id :str):
        return self._db_session.query(SubscriptionCredit).filter(SubscriptionCredit.subscription_id == subscription_id).first()
    
    def find_by_account_id(self, account_id:str):
        stmt = (
            select(SubscriptionCredit.amount)
            .join(UserSubscription, SubscriptionCredit.subscription)
            .where(
                UserSubscription.account_id == account_id,
                UserSubscription.status == "active",
                UserSubscription.deleted_at.is_(None)
            )
        )
        return self._db_session.execute(stmt).scalar_one()
    
    def create(self,subscription_id : str,):
        credit = SubscriptionCredit(
            subscription_id=subscription_id,
            source = "usage",
            amount=10
        )
        self._db_session.add(credit)
        self._db_session.flush()
        return credit
    
    def update(self,subscription_id : str,amount : int):
        return self._db_session.execute(update(SubscriptionCredit).where(SubscriptionCredit.subscription_id == subscription_id).values(SubscriptionCredit.amount == amount))
    
    
    