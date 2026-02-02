from fastapi import Depends
from app.helper.error_handling import UserNotFound, UserPasswordMismatch
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.user_service import UserService
from app.services.user_subscription_service import UserSubscriptionService
from app.utils.jwt import generate_token, verify_token
from app.utils.jwt import oauth2_scheme

class AuthService:
    def __init__(self, user_service : UserService,user_subscription_service : UserSubscriptionService):
        self._user_service = user_service
        self._user_subscription_service = user_subscription_service
        
    def login(self, payload : LoginSchema):
        existing_account = self._user_service.find_by_email(payload.email)
        if payload.password != existing_account.password:
            raise UserPasswordMismatch()
        payload_jwt = {
            "id": str(existing_account.id),
            "email": existing_account.email,
            "role": str(existing_account.account_roles.role.name)
        }
        jwt_token = generate_token(payload=payload_jwt)
        return {
            "token": jwt_token,
        }
        
    
    def register(self, payload : CreateUserSchema):
        return self._user_service.create_user(payload=payload)
    
    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        payload = verify_token(token=token)
        user = self._user_service.find_by_id(payload.get("id"))
        if not user:
            raise UserNotFound()
        user_subscription = self._user_subscription_service.find_user_subscription(user.id)
        pricing =  {
            "id": user_subscription.pricing.id,
            "name": user_subscription.pricing.name,
            "price": user_subscription.pricing.name,
            "max_jobs": user_subscription.pricing.max_jobs,
        }
        data = {
            "id": user.id,
            "email": user.email,
            "role": payload.role,
            "profile": user.profile,
            "pricing":pricing
        }
        return {"id": id, "data": data}