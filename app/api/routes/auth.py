from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
from pydantic import BaseModel
from app.depedencies.user import _get_auth_service, get_auth_service
from app.models.models import Accounts, get_db
from sqlalchemy.orm import Session
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
async def login(login_input: LoginInput, db: Session = Depends(get_db)):
    user = db.query(Accounts).filter(Accounts.email == login_input.email).first()
    print(user)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.password != login_input.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    payload = {"id": user.id}
    token = generate_token(payload)
    return {"token": token, "token_type": "bearer", "role": user.role}


@auth_router.post("/admin/register")
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
