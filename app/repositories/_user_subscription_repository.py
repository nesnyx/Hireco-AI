from sqlalchemy.orm import Session

from app.models.models import UserSubscription

class UserSubscriptionRepository:
    def __init__(self,db_session:Session):
        self._db = db_session
        
    def assign_subscription_to_user(self,account_id:str,pricing_id:str):
        user_subscription = UserSubscription(
            account_id=account_id,
            pricing_id=pricing_id
        )
        self._db.add(user_subscription)
        self._db.commit()
        self._db.refresh(user_subscription)
        return user_subscription
    
    def get_user_subscription(self,account_id:str):
        return self._db.query(UserSubscription).filter(UserSubscription.account_id == account_id).first()