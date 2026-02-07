from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.models.models import RegistrationToken

class RegistrationTokenRepository:
    def __init__(self,db_session : Session):
        self._db_session = db_session
        
    def create(self, token :str, account_id : str):
        new_token = RegistrationToken(
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=2),
            account_id=account_id
        )
        self._db_session.add(new_token)
        self._db_session.commit()
        self._db_session.refresh(new_token)
        return new_token
    
    def find(self, token:str):
        return self._db_session.query(RegistrationToken).filter(RegistrationToken.token == token).first()
    
    def find_by_account_id(self, account_id):
        return self._db_session.query(RegistrationToken).filter(RegistrationToken.account_id == account_id).first()
    
    
    def delete_by_token(self, token : str):
        token = self._db_session.query(RegistrationToken).filter(RegistrationToken.token == token).first()
        if not token:
            raise Exception
        self._db_session.delete(token)
        self._db_session.commit()
        return True