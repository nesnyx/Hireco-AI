from fastapi import (
    Depends,
    APIRouter,
)
import logging
from app.depedencies.role import get_role_service
from app.services.role_service import RoleService

from pydantic import BaseModel
logger = logging.getLogger(__name__)
role_router = APIRouter(prefix="/roles")

class RoleInputSchema(BaseModel):
    name : str

@role_router.post("")
async def create(payload : RoleInputSchema,service : RoleService = Depends(get_role_service)):
    return service.create_role(payload.name)
    