from fastapi import APIRouter, HTTPException, Request
from utils.security import validateuser
from models.category_model import Category

from controllers.category_controller import (
    create_category,
    get_category,
    update_category,
    delete_category,
    list_categories
)
from utils.security import validateadmin,validateuser

router = APIRouter()

@router.post("/categories", response_model=Category, tags=["📂 Categories"])
@validateuser
async def create_category_endpoint(request: Request, category: Category) -> Category:
    """Crear una nueva categoría"""
    return await create_category(category)

@router.get("/categories", response_model=list[Category], tags=["📂 Categories"])
async def list_categories_endpoint() -> list[Category]:
    """Obtener todas las categorías"""
    return list_categories()  # función sincrónica

@router.get("/categories/{category_id}", response_model=Category, tags=["📂 Categories"])
async def get_category_endpoint(category_id: str) -> Category:
    """Obtener una categoría por ID"""
    return await get_category(category_id)

@router.put("/categories/{category_id}", response_model=Category, tags=["📂 Categories"])
@validateuser
async def update_category_endpoint(request: Request, category_id: str, category: Category) -> Category:
    """Actualizar una categoría"""
    return await update_category(category_id, category)

@router.delete("/categories/{category_id}", response_model=dict, tags=["📂 Categories"])
@validateuser
async def delete_category_endpoint(request: Request, category_id: str) -> dict:
    """Eliminar una categoría"""
    return await delete_category(category_id)