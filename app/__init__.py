from fastapi import FastAPI, APIRouter
from app.routes.applicant import applicant_router
from app.routes.auth import auth_router
from app.routes.hr import hr_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hireco", version="0.1.0")

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(applicant_router)
api_router.include_router(auth_router)
api_router.include_router(hr_router)
origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"]

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Mengizinkan asal tertentu
    allow_credentials=True,  # Mengizinkan pengiriman cookies
    allow_methods=["*"],  # Mengizinkan semua method (GET, POST, dll)
    allow_headers=["*"],  # Mengizinkan semua header
)
