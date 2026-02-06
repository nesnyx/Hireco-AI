from datetime import datetime, timezone
from fastapi import Depends
from app.helper.error_handling import RegistrationTokenNotFound, UserNotFound, UserPasswordMismatch
from app.repositories._registration_token_repository import RegistrationTokenRepository
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.user_service import UserService
from app.services.user_subscription_service import UserSubscriptionService
from app.utils.jwt import generate_token, verify_token
from app.utils.jwt import oauth2_scheme
from app.core.events import ee, SEND_EMAIL
import secrets

class AuthService:
    def __init__(self, user_service : UserService,user_subscription_service : UserSubscriptionService,registration_token_repository : RegistrationTokenRepository):
        self._user_service = user_service
        self._user_subscription_service = user_subscription_service
        self._registration_token_repo = registration_token_repository
    def login(self, payload : LoginSchema):
        existing_account = self._user_service.find_by_email(payload.email)
        if payload.password != existing_account.password:
            raise UserPasswordMismatch()
        pricing_name = (
            existing_account.subscriptions[0].pricing.name
            if existing_account.subscriptions
            else None
        )
        payload_jwt = {
            "id": str(existing_account.id),
            "email": existing_account.email,
            "role": str(existing_account.account_roles.role.name),
            "tier" : str(pricing_name) 
        }
        jwt_token = generate_token(payload=payload_jwt)
        return {
            "token": jwt_token,
        }
        
    def register(self, payload : CreateUserSchema):
        new_account = self._user_service.create_user(payload=payload)
        secret_token = secrets.token_urlsafe(32)
        self._registration_token_repo.create(token=secret_token,account_id=new_account.id)
        ee.emit(SEND_EMAIL,new_account.email,secret_token)
        return new_account
    
    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        payload = verify_token(token=token)
        user = self._user_service.find_by_id(payload.get("id"))
        if not user:
            raise UserNotFound()
        data = {
            "id": user.id,
            "email": user.email,
            "role": payload['role'],
            "profile": user.profile,
            "pricing":payload['tier'],
        }
        return {"id": id, "data": data}
    
    
    def verify(self,token):
        existing_token = self._registration_token_repo.find(token)
        if not existing_token:
            raise RegistrationTokenNotFound()
        if existing_token.expires_at <= datetime.now(timezone.utc):
            self._registration_token_repo.delete_by_token(token)
            raise RegistrationTokenNotFound()
        self._user_service.update_status(existing_token.account_id)
        self._registration_token_repo.delete_by_token(token=token)
        return True