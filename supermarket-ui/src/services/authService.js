import { API_BASE_URL, handleResponse } from "./api.js"

export const authService = {

    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Manejo explícito para evitar redirecciones globales del handleResponse en 401
        if (!response.ok) {
            // Intentar leer el cuerpo para obtener mensaje del backend
            let message = 'Error al iniciar sesión. Intenta nuevamente.';
            try {
                const errData = await response.json();
                if (errData && (errData.detail || errData.message)) {
                    message = errData.detail || errData.message;
                }
            } catch {
                // Ignorar errores de parseo
            }

            if (response.status === 401) {
                // Mensaje claro para credenciales inválidas
                throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
            }

            throw new Error(message);
        }

        const data = await response.json();

        if (data.idToken) {
            localStorage.setItem('authToken', data.idToken);
            const userInfo = decodeToken(data.idToken);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }

        return data;
    },

    register: async (name, lastname, email, password) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lastname, email, password })
        });
        const data = await handleResponse(response);
        return data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        if (!token) return false;
        try {
            const userInfo = decodeToken(token);
            return userInfo.exp * 1000 > Date.now();
    } catch {
            return false;
        }
    },

    getCurrentUser: () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo ? JSON.parse(userInfo) : null;
    } catch {
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('authToken')
    }
};

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        throw new Error('Token inválido');
    }
};             