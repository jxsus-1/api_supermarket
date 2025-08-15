import { API_BASE_URL, handleResponse } from './api.js';

// Función auxiliar para obtener el token y validar su existencia
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
  return token;
};

export const categoryService = {
  getAll: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
    });
    return await handleResponse(response);
  },

  create: async (category) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(category),
    });
    return await handleResponse(response);
  },

  update: async (id, category) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(category),
    });
    return await handleResponse(response);
  },

  deactivate: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
    });
    return await handleResponse(response);
  },
};
