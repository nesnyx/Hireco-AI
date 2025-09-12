from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
from pydantic import BaseModel
from app.ai.service.db import Accounts, get_db
from sqlalchemy.orm import Session
from app.utils.jwt import generate_token, get_current_user
import logging
import json

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth")


class RegisterInput(BaseModel):
    email: str
    password: str
    role: str
    full_name: str


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
    return {"token": token, "token_type": "bearer"}


@auth_router.post("/register")
async def register(register_input: RegisterInput, db: Session = Depends(get_db)):
    existing_user = (
        db.query(Accounts).filter(Accounts.email == register_input.email).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    profile_data = {
        "full_name": register_input.full_name,
        "phone": "",
        "address": "",
        "bio": "",
        "social_media": {},
    }
    new_user = Accounts(
        email=register_input.email,
        password=register_input.password,
        role=register_input.role,  # bisa "user", "admin", dll
        profile=json.dumps(profile_data),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "created_at": new_user.created_at,
        },
    }


@auth_router.post("/user/login")
async def user_login(login_input: LoginInput, db: Session = Depends(get_db)):
    user = db.query(Accounts).filter(Accounts.email == login_input.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.password != login_input.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    payload = {"id": user.id}
    token = generate_token(payload)
    return {"token": token, "token_type": "bearer"}


@auth_router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return current_user["data"]

@auth_router.get("/logout")
async def logout():
    pass
