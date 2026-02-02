from dotenv import load_dotenv
import os
load_dotenv()

env_config= {
    "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    "DATABASE_URL": os.getenv("DATABASE_URL"),
    "ALGORITHM": os.getenv("ALGORITHM"),
    "ORIGINS": os.getenv("ORIGINS"),
    "DATABASE_URL": os.getenv("DATABASE_URL"),
}