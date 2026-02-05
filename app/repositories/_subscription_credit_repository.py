from sqlalchemy.orm import Session

from app.models.models import SubscriptionCredit

class SubscriptionCreditRepository:
    def __init__(self,db_session : Session):
        self._db_session = db_session
        
    def create(self,subscription_id : str,):
        credit = SubscriptionCredit(
            subscription_id=subscription_id,
            source = "usage",
            amount=10
        )
        self._db_session.add(credit)
        self._db_session.flush()
        return credit
    
    
    