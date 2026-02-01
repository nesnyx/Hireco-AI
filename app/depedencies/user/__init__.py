from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.models import get_db
from app.repositories._user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.user_service import UserService


def _get_user_repository(db: Session = Depends(get_db)) ->UserRepository:
    return UserRepository(db)

def _get_user_service(repo :UserRepository = Depends(_get_user_repository)) ->UserService:
    return UserService(repo)


def get_auth_service(service : UserService = Depends(_get_user_service)) -> AuthService:
    return AuthService(service)