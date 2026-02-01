from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
import logging

from app.depedencies.role import get_role_service
from app.depedencies.user import _get_user_service
from app.services.role_service import RoleService
from app.services.user_service import UserService

logger = logging.getLogger(__name__)
role_router = APIRouter(prefix="/roles")

@role_router.post("")
async def create(name : str,service : RoleService = Depends(get_role_service)):
    return service.create_role(name)
    