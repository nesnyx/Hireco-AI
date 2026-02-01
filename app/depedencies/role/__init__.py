from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.models import get_db
from app.repositories._role_repository import RoleRepository
from app.services.role_service import RoleService

def _get_role_repository(
    db: Session = Depends(get_db),
) -> RoleRepository:
    return RoleRepository(db)

def get_role_service(
    repo: RoleRepository = Depends(_get_role_repository),
) -> RoleService:
    return RoleService(repo)
