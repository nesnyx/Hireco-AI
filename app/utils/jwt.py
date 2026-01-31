from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
import os
from requests import Session
from app.ai.service.models import Accounts, get_db, Pricing, UserSubscription

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Fungsi untuk generate token
def generate_token(payload: dict, exp_minutes: int = 90000):
    """
    Membuat JWT token dengan python-jose
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=exp_minutes)
    payload_copy = payload.copy()
    payload_copy.update({"exp": expire})
    token = jwt.encode(payload_copy, SECRET_KEY, algorithm=ALGORITHM)
    return token


# Fungsi untuk verify token
def verify_token(token: str):
    """
    Memverifikasi JWT token
    """
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_payload
    except jwt.ExpiredSignatureError:
        print("❌ Token sudah kadaluarsa!")
        return None
    except JWTError:
        print("❌ Token tidak valid!")
        return None


def get_current_user(
    token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("id")
        
        if id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(Accounts).filter(Accounts.id == id).first()
    if user is None:
        raise credentials_exception
    user_subscription =  db.query(UserSubscription).filter(UserSubscription.account_id == id).first()
    
    pricing =  {
        "id": user_subscription.pricing.id,
        "name": user_subscription.pricing.name,
        "price": user_subscription.pricing.price_per_month,
        "max_jobs": user_subscription.pricing.max_jobs,
    }
    data = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "profile": user.profile,
        "pricing":pricing
    }
    return {"id": id, "data": data}
