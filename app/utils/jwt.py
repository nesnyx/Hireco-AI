from datetime import datetime, timedelta, timezone
import json
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt

from fastapi.security import OAuth2PasswordBearer
from app.core.env import env_config
from sqlalchemy.orm import Session, joinedload
from app.helper.error_handling import InvalidCredentials
from app.models.models import Accounts, SubscriptionCredit, get_db,  UserSubscription


SECRET_KEY = env_config.get("SECRET_KEY")
ALGORITHM = env_config.get("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def generate_token(payload: dict, exp_minutes: int = 90000):
    """
    Membuat JWT token dengan python-jose
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=exp_minutes)
    payload_copy = payload.copy()
    payload_copy.update({"exp": expire})
    token = jwt.encode(payload_copy, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_payload
    except jwt.ExpiredSignatureError:
        raise InvalidCredentials()
    except JWTError:
        raise InvalidCredentials()


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id") # ganti nama var 'id' agar tidak bentrok dengan built-in python
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 1. Ambil User
    user = db.query(Accounts).filter(Accounts.id == user_id).first()
    if user is None:
        raise credentials_exception

    # 2. Ambil Subscription SEKALIGUS dengan data Pricing (Eager Loading)
    # Gunakan joinedload agar data pricing langsung nempel di memori
    user_subscription = (
        db.query(UserSubscription)
        .options(joinedload(UserSubscription.pricing)) 
        .filter(UserSubscription.account_id == user_id)
        .first()
    )

    # Antisipasi jika user belum punya subscription
    pricing_name = user_subscription.pricing.name if user_subscription and user_subscription.pricing else "Free"
    sub_id = user_subscription.id if user_subscription else None

    # 3. Ambil Credit
    credit_amount = 0
    if sub_id:
        credit = db.query(SubscriptionCredit).filter(SubscriptionCredit.subscription_id == sub_id).first()
        credit_amount = credit.amount if credit else 0

    data = {
        "id": user.id,
        "email": user.email,
        "role": payload.get("role"),
        "profile": json.loads(user.profile) if user.profile else {},
        "pricing": pricing_name,
        "credit": credit_amount
    }
    
    return {"id": user_id, "data": data}
