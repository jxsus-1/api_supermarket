from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Product(BaseModel):
    id: Optional[str] = Field(
        default=None,
        description="ID único del producto (generado automáticamente por MongoDB)"
    )
    category_id: str = Field(
        description="ID de la categoría a la que pertenece el producto"
    )
    name: str = Field(
        description="Nombre del producto",
        examples=["Leche entera 1L", "Pan integral"]
    )
    description: Optional[str] = Field(
        default="",
        description="Descripción del producto",
        examples=["Leche fresca pasteurizada", "Pan de trigo integral"]
    )
    price: float = Field(
        description="Precio unitario del producto",
        gt=0,
        examples=[1.50, 0.99]
    )
    stock: Optional[int] = Field(
        default=0,
        description="Cantidad en inventario",
        ge=0
    )
    availability: bool = Field(
        default=True,
        description="Indica si el producto está disponible en el catálogo"
    )

    class Config:
        # Permite que Pydantic maneje ObjectId de MongoDB
        json_encoders = {
            ObjectId: str
        }