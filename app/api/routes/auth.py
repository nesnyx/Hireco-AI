from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
from pydantic import BaseModel
from app.models.models import Accounts, get_db, Pricing, UserSubscription
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.utils.jwt import generate_token, get_current_user
import logging
import json

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth")


class RegisterInput(BaseModel):
    email: str
    password: str
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
    return {"token": token, "token_type": "bearer", "role": user.role}


@auth_router.post("/admin/register")
async def admin_register(register_input: RegisterInput, db: Session = Depends(get_db)):
    try:
        with db.begin():
            existing_user = (
                db.query(Accounts)
                .filter(Accounts.email == register_input.email)
                .first()
            )
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")

            profile_data = {
                "full_name": register_input.full_name,
                "phone": "",
                "address": "",
                "bio": "",
                "company": "",
                "type": "",
            }
            new_user = Accounts(
                email=register_input.email,
                password=register_input.password,
                role="hr",
                profile=json.dumps(profile_data),
            )
            db.add(new_user)
            db.flush()  


            pricing = db.query(Pricing).filter(Pricing.name == "Free").first()
            if not pricing:
                raise HTTPException(status_code=400, detail="Free pricing not found")

            new_subscription = UserSubscription(
                account_id=new_user.id,
                pricing_id=pricing.id,
                is_active=True,
                end_date=None, 
            )
            db.add(new_subscription)


        return {
            "success": True,
            "message": "Admin registered successfully",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "role": new_user.role,
                "created_at": new_user.created_at,
            },
        }
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()  
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


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
        role="user",  # bisa "user", "admin", dll
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
