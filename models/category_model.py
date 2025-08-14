from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Category(BaseModel):
    id: Optional[str] = Field(
        default=None,
        description="ID único de la categoría (generado automáticamente por MongoDB)"
    )
    name: str = Field(
        description="Nombre de la categoría",
        examples=["Lácteos", "Panadería", "Bebidas"]
    )
    description: Optional[str] = Field(
        default="",
        description="Descripción de la categoría",
        examples=["Productos lácteos como leche, queso, yogurt"]
    )

    class Config:
        # Esto permite que Pydantic maneje ObjectId de MongoDB
        json_encoders = {
            ObjectId: str
        }