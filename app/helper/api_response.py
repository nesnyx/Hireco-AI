import json
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
class ResponseWrapperMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if response.headers.get("content-type") == "application/json":
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            data = json.loads(body)
            standard_response = {
                "status": "success" if response.status_code < 400 else "error",
                "message": "Operation successful", # Bisa dinamis
                "data": data
            }

            return JSONResponse(
                content=standard_response,
                status_code=response.status_code
            )
        
        return response