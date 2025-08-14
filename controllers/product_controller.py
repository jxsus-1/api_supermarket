# controllers/controllers_product.py
import logging
from fastapi import HTTPException
from models.product_model import Product
from utils.mongodb import get_collection
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_product(product: Product) -> Product:
    try:
        coll = get_collection("products")
        product_dict = product.dict(exclude={"id"})

        # Validaciones básicas
        if product.price <= 0:
            raise HTTPException(status_code=400, detail="El precio debe ser mayor que cero.")

        # Verificar que la categoría existe
        category_exists = get_collection("categories").find_one({"_id": ObjectId(product.category_id)})
        if not category_exists:
            raise HTTPException(status_code=404, detail="La categoría no existe.")

        inserted = coll.insert_one(product_dict)
        product.id = str(inserted.inserted_id)
        return product

    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def get_product(product_id: str) -> Product:
    try:
        coll = get_collection("products")
        product_data = coll.find_one({"_id": ObjectId(product_id)})
        if not product_data:
            raise HTTPException(status_code=404, detail="Producto no encontrado.")
        return Product(id=str(product_data['_id']), **product_data)
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def update_product(product_id: str, product: Product) -> Product:
    try:
        coll = get_collection("products")
        product_dict = product.dict(exclude={"id"})

        if product.price <= 0:
            raise HTTPException(status_code=400, detail="El precio debe ser mayor que cero.")

        category_exists = get_collection("categories").find_one({"_id": ObjectId(product.category_id)})
        if not category_exists:
            raise HTTPException(status_code=404, detail="La categoría no existe.")

        result = coll.update_one({"_id": ObjectId(product_id)}, {"$set": product_dict})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado.")

        updated_product = coll.find_one({"_id": ObjectId(product_id)})
        return Product(id=str(updated_product['_id']), **updated_product)
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def delete_product(product_id: str) -> dict:
    try:
        coll = get_collection("products")
        if not ObjectId.is_valid(product_id):
            raise HTTPException(status_code=400, detail="ID de producto no válido.")
        result = coll.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado.")
        return {"message": "Producto eliminado con éxito.", "id": product_id}
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def list_products() -> list[Product]:
    try:
        coll = get_collection("products")
        products_data = list(coll.find({}))
        if not products_data:
            return []
        return [Product(id=str(p['_id']), **p) for p in products_data]
    except Exception as e:
        logger.error(f"Error al obtener productos: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al obtener la lista de productos")