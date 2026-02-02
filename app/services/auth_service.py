from app.helper.error_handling import UserPasswordMismatch
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.user_service import UserService
from app.utils.jwt import generate_token


class AuthService:
    def __init__(self, user_service : UserService):
        self._user_service = user_service
        
    def login(self, payload : LoginSchema):
        existing_account = self._user_service.find_by_email(payload.email)
        if payload.password != existing_account.password:
            raise UserPasswordMismatch()
        payload_jwt = {
            "id": existing_account.id,
            "email": existing_account.email,
            "role":existing_account.account_roles
        }
        print(payload_jwt)
        jwt_token = generate_token(payload=payload_jwt)
        return jwt_token
        
    
    def register(self, payload : CreateUserSchema):
        return self._user_service.create_user(payload=payload)