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

@app.get("/")
def read_root():
    return {"version": "0.0.0"}

@app.post("/users")
async def create_user_endpoint(user: User) -> User:
    return await create_user(user)

@app.post("/login")
async def login_access(log: Login) -> dict:
    return await login(log)

@app.get("/exampleadmin")
@validateadmin
async def example_admin(request: Request):
    return {
        "message": "This is an example admin endpoint.",
        "admin": request.state.admin
    }

@app.get("/exampleuser")
@validateuser
async def example_user(request: Request):
    return {
        "message": "This is an example user endpoint.",
        "email": request.state.email
    }


app.include_router(category_router, tags=["📂 Categories"])
app.include_router(product_router, tags=["🛒 Products"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")