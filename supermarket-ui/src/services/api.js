const API_BASE_URL = 'https://supermarket-api-production-afe3.up.railway.app';
// const API_BASE_URL = 'http://localhost:8080';

const handleResponse = async (response) => {
  let data;

  try {
    // Intentamos leer JSON; si falla, devolvemos null
    data = await response.clone().json().catch(() => null);
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.log(`Error ${response.status} del backend:`, data || await response.text());

    switch (response.status) {
      case 400:
        throw new Error(data?.message || 'Solicitud incorrecta. Verifica los datos enviados.');
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        if (typeof window !== 'undefined') {
          const loginHashUrl = `${window.location.origin}${window.location.pathname}#/login`;
          const currentUrl = window.location.href;
          const alreadyOnLogin = currentUrl.includes('#/login') || currentUrl.endsWith('/login');
          if (!alreadyOnLogin) window.location.replace(loginHashUrl);
        }
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('El recurso solicitado no fue encontrado.');
      case 409:
        throw new Error(data?.message || 'Conflicto: el recurso ya existe.');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`);
    }
  }

  // Retornamos JSON si existe, sino texto plano
  try {
    return data ?? await response.text();
  } catch {
    return null;
  }
};

export { API_BASE_URL, handleResponse };
