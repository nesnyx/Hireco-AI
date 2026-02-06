from datetime import datetime, timedelta, timezone
import json
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt

from fastapi.security import OAuth2PasswordBearer
from app.core.env import env_config
from requests import Session
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
    credit = db.query(SubscriptionCredit).filter(SubscriptionCredit.subscription_id == user_subscription.id).first()
    data = {
        "id": user.id,
        "email": user.email,
        "role": payload["role"],
        "profile": json.loads(user.profile),
        "pricing":user_subscription.pricing.name,
        "credit":credit.amount
    }
    return {"id": id, "data": data}
