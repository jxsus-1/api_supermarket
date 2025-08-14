import { API_BASE_URL, handleResponse } from "./api.js";

export const productService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  create: async (product) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_category: product.id_category,       // antes id_catalog_type
          name: product.name,
          description: product.description,
          cost: parseFloat(product.cost),
          discount: parseInt(product.discount) || 0,
          active: product.active ?? true
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  update: async (id, product) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_category: product.id_category,
          name: product.name,
          description: product.description,
          cost: parseFloat(product.cost),
          discount: parseInt(product.discount) || 0,
          active: product.active
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  deactivate: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al desactivar producto:', error);
      throw error;
    }
  }
};
