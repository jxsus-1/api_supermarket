import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Mensaje destacado */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-black-400 drop-shadow-lg">
                        Supermarket
                    </h2>
                    <p className="text-black-200 mt-2 text-lg drop-shadow-md">
                        Supermarket para la familia
                    </p>
                </div>

                {/* Contenedor donde iría la imagen */}
                <div className="flex justify-center items-center py-10">
                    <div className="w-96 h-64 rounded-lg shadow-2xl border-4 border-yellow-400 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">Imagen no disponible</span>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Dashboard;
