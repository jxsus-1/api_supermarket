import uvicorn
import logging

from fastapi import FastAPI, Request

from controllers.user_controller import create_user, login
from models.user_model import User
from models.login_model import Login

from utils.security import validateuser, validateadmin

from routes.category_routes import router as category_router
from routes.product_routes import router as product_router



app = FastAPI()

# Add CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  
)

# Incluir routers
app.include_router(category_router)
app.include_router(product_router)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
def read_root():
    return {"status": "healthy", "version": "0.0.0", "service": "dulceria-api"}

@app.get("/health")
def health_check():
    try:
        return {
            "status": "healthy", 
            "timestamp": "2025-08-02", 
            "service": "supermarket-api",
            "environment": "production"
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/ready")
def readiness_check():
    try:
        from utils.mongodb import test_connection
        db_status = test_connection()
        return {
            "status": "ready" if db_status else "not_ready",
            "database": "connected" if db_status else "disconnected",
            "service": "dulceria-api"
        }
    except Exception as e:
        return {"status": "not_ready", "error": str(e)}

@app.post("/users")
async def create_user_endpoint(user: User) -> User:
    return await create_user(user)

@app.post("/login")
async def login_access(l: Login) -> dict:
    return await login(l)


@app.get("/exampleadmin")
@validateadmin
async def example_admin(request: Request):
    return {
        "message": "This is an example admin endpoint."
        , "admin": request.state.admin
    }

@app.get("/exampleuser")
@validateuser
async def example_user(request: Request):
    return {
        "message": "This is an example user endpoint."
        ,"email": request.state.email
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")