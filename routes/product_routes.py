from fastapi import APIRouter, Request
from controllers.product_controller import (
    create_product,
    get_product,
    update_product,
    delete_product,
    list_products
)
from models.product_model import Product
from utils.security import validateadmin

router = APIRouter()

@router.post("/products", response_model=Product, tags=["🛒 Products"])
@validateadmin
async def create_new_product(request: Request, product: Product) -> Product:
    """Crear un nuevo producto"""
    return await create_product(product)

@router.get("/products/{product_id}", response_model=Product, tags=["🛒 Products"])
async def read_product(product_id: str) -> Product:
    """Obtener un producto por ID"""
    return await get_product(product_id)

@router.put("/products/{product_id}", response_model=Product, tags=["🛒 Products"])
@validateadmin
async def update_existing_product(request: Request, product_id: str, product: Product) -> Product:
    """Actualizar un producto"""
    return await update_product(product_id, product)

@router.delete("/products/{product_id}", response_model=dict, tags=["🛒 Products"])
@validateadmin
async def remove_product(request: Request, product_id: str) -> dict:
    """Eliminar un producto"""
    return await delete_product(product_id)

@router.get("/products", response_model=list[Product], tags=["🛒 Products"])
async def read_products() -> list[Product]:
    """Listar todos los productos"""
    return await list_products()