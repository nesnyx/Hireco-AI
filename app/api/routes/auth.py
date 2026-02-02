from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
from pydantic import BaseModel
from app.depedencies.user import _get_auth_service, get_auth_service
from app.models.models import Accounts, get_db
from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.auth_service import AuthService
from app.utils.jwt import generate_token, get_current_user
import logging


logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth")




class LoginInput(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    role: str


@auth_router.post("/login")
async def login(payload: LoginSchema, service: AuthService = Depends(get_auth_service)):
   return service.login(payload)


@auth_router.post("/register")
async def register(payload : CreateUserSchema, service: AuthService = Depends(get_auth_service)):
    return service.register(payload)


@auth_router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return current_user["data"]


@auth_router.delete("/delete-account/{id}")
async def delete_account(id: int, db: Session = Depends(get_db)):
    user = db.query(Accounts).filter(Accounts.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User account deleted"}


@auth_router.get("/logout")
async def logout():
    pass
