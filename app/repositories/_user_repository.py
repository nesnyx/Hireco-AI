import json
from sqlalchemy.orm import Session

from app.models.models import Accounts
from app.schemas.user_schema import CreateUserSchema

class UserRepository:
    def __init__(self,db_session:Session):
        self._db = db_session
    def save(self, payload : CreateUserSchema):
        profile_data = {
                "full_name": payload.name,
                "phone": "",
                "address": "",
                "bio": "",
                "company": "",
                "type": "",
            }
        new_user = Accounts(
            email=payload.email,
            password=payload.password,
            profile=json.dumps(profile_data)
        )
        self._db.add(new_user)
        self._db.flush()
        return new_user
        
    
    def get_by_email(self, email :str):
        return self._db.query(Accounts).filter(Accounts.email == email).first()
    
    def get_by_id(self, id : str):
        return self._db.query(Accounts).filter(Accounts.id == id).first()
    