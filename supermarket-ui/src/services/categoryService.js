import { API_BASE_URL, handleResponse } from "./api.js";

export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  // Obtener categoría por ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw error;
    }
  },

  // Crear categoría
  create: async (category) => {
    try {
      const token = localStorage.getItem('authToken');

      // Validar campos obligatorios
      if (!category.name || !category.description) {
        throw new Error("Los campos 'name' y 'description' son obligatorios.");
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          active: category.active ?? true
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  },

  // Actualizar categoría
  update: async (id, category) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!category.name || !category.description) {
        throw new Error("Los campos 'name' y 'description' son obligatorios.");
      }

      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          active: category.active ?? true
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  },

  // Desactivar categoría
  deactivate: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al desactivar categoría:', error);
      throw error;
    }
  }
};
