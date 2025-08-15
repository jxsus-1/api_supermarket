import { API_BASE_URL, handleResponse } from "./api.js";

export const productService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Token de autorización no encontrado. Debes iniciar sesión.");
      }

      console.log("Solicitando productos con token:", token);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);

      // Garantiza que siempre se retorne un array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  // Obtener un producto por ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autorización no encontrado.");

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },

  // Crear un producto
  create: async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autorización no encontrado.");

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: product.category_id,
          name: product.name,
          description: product.description,
          image: product.image || "",
          price: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          stock: Number(product.stock) || 0
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  // Actualizar un producto
  update: async (id, product) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autorización no encontrado.");

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: product.category_id,
          name: product.name,
          description: product.description,
          image: product.image || "",
          price: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          stock: Number(product.stock) || 0
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  // Desactivar/eliminar un producto
  deactivate: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autorización no encontrado.");

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error al desactivar producto:", error);
      throw error;
    }
  }
};
