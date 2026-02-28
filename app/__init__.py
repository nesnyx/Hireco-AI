from fastapi import FastAPI, APIRouter, Request,status,HTTPException
from fastapi.responses import JSONResponse
from app.api.routes.applicant import applicant_router
from app.api.routes.auth import auth_router
from app.api.routes.hr import hr_router
from app.api.routes.pricing import pricing_router
from app.api.routes.role import role_router
from app.api.routes.subscription import subscription_router
from fastapi.middleware.cors import CORSMiddleware
from app.helper.api_response import ResponseWrapperMiddleware
from app.helper.error_handling import CreditDischarge, CreditNotFound, InvalidCredentials, PricingAlreadyExists, PricingNotFound, RegistrationTokenNotFound, RoleNotFound, UserNotFound, UserNotVerify, UserPasswordMismatch
from app.core.env import env_config
from app.subscribers import analysis_subscriber,email_subscriber
origins = [env_config.get("ORIGINS")]
app = FastAPI(title="Hireco", version="0.1.0")
app.add_middleware(ResponseWrapperMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://hireco.nadinata.org','http://localhost:3000'],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applicant_router)
app.include_router(auth_router)
app.include_router(hr_router)
app.include_router(pricing_router)
app.include_router(role_router)
app.include_router(subscription_router)

@app.get("/health")
def health():
    return "ok"

@app.exception_handler(PricingAlreadyExists)
async def pricing_exists_handler(request: Request, exc):
        return JSONResponse(
        status_code=400,
        content={"detail": "Pricing plan already exists"},
        )
        

@app.exception_handler(PricingNotFound)
async def pricing_not_found_handler(request: Request, exc):
        return JSONResponse(
        status_code=404,
        content={"detail": "Pricing plan not found"},
        )

@app.exception_handler(RoleNotFound)
async def role_not_found_handler(request: Request, exc):
        return JSONResponse(
        status_code=404,
        content={"detail": "Role not found"},
        )
        
@app.exception_handler(UserNotFound)
async def user_not_found_handler(request: Request, exc):
        return JSONResponse(
        status_code=404,
        content={"detail": "User not found"},
        )


@app.exception_handler(UserPasswordMismatch)
async def user_password_mismatch_handler(request: Request, exc):
        return JSONResponse(
        status_code=401,
        content={"detail": "Your Password Wrong"},
        )
        
        
@app.exception_handler(InvalidCredentials)
async def invalid_credentials(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Could not validate credentials"},
        headers={"WWW-Authenticate": "Bearer"},
    )
    
        
@app.exception_handler(RegistrationTokenNotFound)
async def registration_token_expired(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Invalid URL or Expired"},

    )
    
@app.exception_handler(UserNotVerify)
async def user_not_verify(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Your Acoount Has not been Verify"},
    )
    
    
@app.exception_handler(CreditNotFound)
async def credit_not_found(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Your Credit Not Found"},
    )
    
@app.exception_handler(CreditDischarge)
async def credit_discharge(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Your Credit Discharge"},
    )