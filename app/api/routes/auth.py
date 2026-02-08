from fastapi import (
    Depends,
    APIRouter,
    Query,Body
)
from fastapi.responses import RedirectResponse
from app.depedencies.user import  get_auth_service
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.auth_service import AuthService
from app.utils.jwt import  get_current_user
import logging
from pydantic import BaseModel

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth")
FRONTEND_BASE_URL = "https://hireco.nadinata.org"


class VerifyBody(BaseModel):
    token : str

@auth_router.post("/login")
async def login(payload: LoginSchema, service: AuthService = Depends(get_auth_service)):
   return service.login(payload)


@auth_router.post("/register")
async def register(payload : CreateUserSchema, service: AuthService = Depends(get_auth_service)):
    return service.register(payload)


@auth_router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return current_user["data"]



@auth_router.post("/verify")
async def verify(payload : VerifyBody, service: AuthService = Depends(get_auth_service)):
    token_verify = service.verify(payload.token)
    return token_verify

@auth_router.post("/resend-verification")
async def resend_verification(payload : VerifyBody, service: AuthService = Depends(get_auth_service)):
    resend = service.resend_verification(payload.token)
    return resend