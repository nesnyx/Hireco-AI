from fastapi import (
    Depends,
    APIRouter,
    Query
)
from fastapi.responses import RedirectResponse
from app.depedencies.user import  get_auth_service
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.auth_service import AuthService
from app.utils.jwt import  get_current_user
import logging


logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth")
FRONTEND_BASE_URL = "https://hireco.nadinata.org"


@auth_router.post("/login")
async def login(payload: LoginSchema, service: AuthService = Depends(get_auth_service)):
   return service.login(payload)


@auth_router.post("/register")
async def register(payload : CreateUserSchema, service: AuthService = Depends(get_auth_service)):
    return service.register(payload)


@auth_router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return current_user["data"]



@auth_router.get("/verify")
async def verify(token : str = Query(...), service: AuthService = Depends(get_auth_service)):
    token_verify = service.verify(token)
    if token_verify["msg"] == "expired":
        return RedirectResponse(
            f"{FRONTEND_BASE_URL}/verify?status=expired"
        )
    elif token_verify["msg"] == "not_found":
        return RedirectResponse(
            f"{FRONTEND_BASE_URL}/verify?status=invalid"
        )

    return RedirectResponse(
        f"{FRONTEND_BASE_URL}/verify?status=success"
    )

@auth_router.get("/resend-verification")
async def resend_verification(email : str = Query(...), service: AuthService = Depends(get_auth_service)):
    resend = service.resend_verification(email=email)
    if resend["msg"] == "resend":
        return RedirectResponse(
            f"{FRONTEND_BASE_URL}/resend-verification?status=resend"
        )
    
    if resend["msg"] == "verify":
        return RedirectResponse(
            f"{FRONTEND_BASE_URL}/resend-verification?status=verify"
        )
    
    
    return RedirectResponse(
            f"{FRONTEND_BASE_URL}/resend-verification?status=invalid"
    )