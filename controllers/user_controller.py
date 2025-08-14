
import logging
import os
import requests
from utils.firebase_auth import cred
from models.user_model import User
from fastapi import HTTPException
from firebase_admin import credentials, auth as firebase_auth
from utils.mongodb import get_collection
from models.login_model import Login
from utils.security import create_jwt_token

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_user( user: User) -> User:

    user_record = {}
    try:
        user_record = firebase_auth.create_user(
            email=user.email
            , password=user.password
        )
    except Exception as e:
        logger.warning( e )
        raise HTTPException(
            status_code=400
            , detail="Error al registrar usuario en firebase"
        )

    try:
        coll = get_collection("users")

        new_user = User(
            name=user.name
            , lastname=user.lastname
            , email=user.email
            , password=user.password
        )

        user_dict = new_user.model_dump(exclude={"id", "password"})
        inserted = coll.insert_one(user_dict)
        new_user.id = str(inserted.inserted_id)
        new_user.password = "*********" 
        return new_user

    except Exception as e:
        firebase_auth.delete_user(user_record.uid)
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
async def login(login: Login) -> dict:
    api_key = os.getenv("FIREBASE_API_KEY")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": login.email,
        "password": login.password,
        "returnSecureToken": True
    }
    
    response = requests.post(url, json=payload)
    response_data = response.json()

    if "error" in response_data:
        raise HTTPException(
            status_code=400
            , detail="Error al autenticar usuario"
        )
    coll = get_collection("users")
    user_info = coll.find_one({ "email": login.email })

    if not user_info:
        raise HTTPException(
            status_code=404
            , detail="Usuario no encontrado en la base de datos"
        )
    
    return {
        "message": "Usuario auntenticado", "idToken": create_jwt_token(
            user_info["name"]
            , user_info["lastname"]
            , user_info["email"]
            , user_info["active"]
            , user_info["admin"]
            , str(user_info["_id"])
        )

    }