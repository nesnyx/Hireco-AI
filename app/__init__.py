from fastapi import FastAPI, APIRouter, Request,status,HTTPException
from fastapi.responses import JSONResponse
from app.api.routes.applicant import applicant_router
from app.api.routes.auth import auth_router
from app.api.routes.hr import hr_router
from app.api.routes.pricing import pricing_router
from app.api.routes.role import role_router
from fastapi.middleware.cors import CORSMiddleware
from app.helper.error_handling import InvalidCredentials, PricingAlreadyExists, PricingNotFound, RoleNotFound, UserNotFound, UserPasswordMismatch
from app.core.env import env_config

app = FastAPI(title="Hireco", version="0.1.0")
api_router = APIRouter()
api_router.include_router(applicant_router)
api_router.include_router(auth_router)
api_router.include_router(hr_router)
api_router.include_router(pricing_router)
api_router.include_router(role_router)
origins = [env_config.get("ORIGINS")]

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Mengizinkan asal tertentu
    allow_credentials=True,  # Mengizinkan pengiriman cookies
    allow_methods=["GET", "POST", "PUT", "DELETE","PATCH"],  # Mengizinkan semua method (GET, POST, dll)
    allow_headers=["*"],  # Mengizinkan semua header
)

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
        content={"detail": "Invalid Credentials"},
        )
        
        
@app.exception_handler(InvalidCredentials)
async def invalid_credentials(request : Request, exc):
        return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
        )