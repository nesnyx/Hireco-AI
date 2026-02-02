from app.models.models import Role,AccountRole
from sqlalchemy.orm import Session
from enum import Enum

class RoleName(Enum):
    USER = "user"

class RoleRepository:
    def __init__(self, db: Session):
        self._db = db

    def get_role_by_name(self, name: str) -> Role:
        return self._db.query(Role).filter(Role.name == name).first()


    def save(self, name: str) -> Role:
        new_role = Role(name=name)
        self._db.add(new_role)
        self._db.commit()
        self._db.refresh(new_role)
        return new_role
    
    def assign_role_to_user(self, account_id: str, role_id: str):
        account_role = AccountRole(
            account_id=account_id,
            role_id=role_id
        )
        self._db.add(account_role)
        self._db.flush()
        return account_role