import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"



const Layout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout, validateToken } = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!validateToken()) {
                clearInterval(interval);
            }
        }, 60000);

        validateToken();

        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate('/ventacamisetas.ui/login');

    }

return (
  <div className="relative min-h-screen bg-yellow-50">

    {/* Contenido principal */}
    <div className="relative z-10">

      {/* Encabezado */}
      <header className="bg-black bg-opacity-90 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4 border-b-2 border-yellow-400">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚽</span>
              <div>
                <h1 className="text-2xl font-bold text-yellow-400">
                  Bienvenido a la mejor tienda de camisetas
                </h1>
                <p className="text-yellow-200">
                  Hola <span className="font-semibold">{`${user.firstname} ${user.lastname}`}</span>
                </p>
              </div>
            </div>
            <button
              className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors font-medium shadow"
              onClick={handleLogout}
            >
              🚪 Cerrar Sesión
            </button>
          </div>

          {/* Barra de navegación */}
          <nav className="py-4">
            <ul className="flex space-x-6">
              <li>
                <button
                  className="flex items-center px-4 py-2 text-yellow-400 font-bold hover:text-black hover:bg-yellow-400 rounded-md transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
                  <span className="mr-2">🏠</span>
                  Inicio
                </button>
              </li>
              <li>
                <button
                  className="flex items-center px-4 py-2 text-yellow-400 font-bold hover:text-black hover:bg-yellow-400 rounded-md transition-colors"
                  onClick={() => navigate('/categories')}
                >
                  <span className="mr-2">🛡️</span>
                  Equipos de Fútbol
                </button>
              </li>
              <li>
                <button
                  className="flex items-center px-4 py-2 text-yellow-400 font-bold hover:text-black hover:bg-yellow-400 rounded-md transition-colors"
                  onClick={() => navigate('/shirts')}
                >
                  <span className="mr-2">👕</span>
                  Camisetas
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children} {/* Aquí se muestran tus equipos y demás datos */}
      </main>

      {/* Pie de página */}
      <footer className="bg-black bg-opacity-90 text-yellow-400 py-4 mt-8 border-t-2 border-yellow-400">
        <div className="max-w-6xl mx-auto text-center text-sm">
          © {new Date().getFullYear()} Tienda de Camisetas Futboleras — Pasión por el deporte ⚽
        </div>
      </footer>

    </div>
  </div>
);



}

export default Layout