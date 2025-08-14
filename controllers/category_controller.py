import logging
from fastapi import HTTPException
from models.category_model import Category
from utils.mongodb import get_collection
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CREATE
async def create_category(category: Category) -> Category:
    try:
        coll = get_collection("categories")
        category_dict = category.model_dump(exclude={"id"})
        inserted = coll.insert_one(category_dict)
        category.id = str(inserted.inserted_id)
        return category
    except Exception as e:
        logger.error(f"Error creating category: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# GET BY ID
async def get_category(category_id: str) -> Category:
    try:
        coll = get_collection("categories")
        category_data = coll.find_one({"_id": ObjectId(category_id)})
        if not category_data:
            raise HTTPException(status_code=404, detail="Category not found")
        return Category(id=str(category_data['_id']), name=category_data['name'])
    except Exception as e:
        logger.error(f"Error fetching category: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# UPDATE
async def update_category(category_id: str, category: Category) -> Category:
    try:
        coll = get_collection("categories")
        category_dict = category.model_dump(exclude={"id"})
        result = coll.update_one({"_id": ObjectId(category_id)}, {"$set": category_dict})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Category not found")

        updated_category_data = coll.find_one({"_id": ObjectId(category_id)})
        if not updated_category_data:
            raise HTTPException(status_code=404, detail="Category not found after update")

        return Category(id=str(updated_category_data['_id']), name=updated_category_data['name'])
    except Exception as e:
        logger.error(f"Error updating category: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# DELETE
async def delete_category(category_id: str) -> dict:
    try:
        coll = get_collection("categories")
        result = coll.delete_one({"_id": ObjectId(category_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"message": "Category deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting category: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# LIST
def list_categories() -> list[Category]:
    try:
        coll = get_collection("categories")
        categories_data = list(coll.find({}))
        if not categories_data:
            return []

        logger.info(f"Categories data: {categories_data}")
        return [Category(id=str(cat['_id']), name=cat['name']) for cat in categories_data]
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal error fetching categories")