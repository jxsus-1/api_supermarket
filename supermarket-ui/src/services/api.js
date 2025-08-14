const API_BASE_URL = 'https://supermarket-api-production-afe3.up.railway.app';
//const API_BASE_URL = 'http://localhost:8080';


const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    switch (response.status) {
      case 400:
        throw new Error(errorData.message || 'Este email ya está registrado. Intenta con otro email.');
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        if (typeof window !== 'undefined') {
          // Compatibilidad con HashRouter en GitHub Pages
          const loginHashUrl = `${window.location.origin}${window.location.pathname}#/login`;
          const currentUrl = window.location.href;
          const alreadyOnLogin = currentUrl.includes('#/login') || currentUrl.endsWith('/login');
          if (!alreadyOnLogin) {
            window.location.replace(loginHashUrl);
          }
        }
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('El recurso solicitado no fue encontrado.');
      case 409:
        throw new Error('El usuario ya existe en el sistema.');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

export { API_BASE_URL, handleResponse };