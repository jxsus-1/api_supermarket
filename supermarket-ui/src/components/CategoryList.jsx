import { useState, useEffect } from 'react';
import { categoryService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from "./Layout";
import CategoriesForm from './CategoryForm';

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => setRecentlyUpdated(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadCategories = async () => {
        if (!validateToken()) return;

        try {
            setLoading(true);
            setError('');
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            setError(error.message || 'Error al cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!validateToken()) return;

        const hasProducts = item.number_of_products > 0;
        const action = hasProducts ? 'desactivar' : 'eliminar';
        const consequence = hasProducts
            ? `Esta categoría tiene ${item.number_of_products} producto(s) asociado(s). Se desactivará pero se mantendrá la integridad de los datos.`
            : 'Esta categoría será eliminada permanentemente del sistema.';

        const confirmed = window.confirm(
            `¿Estás seguro de ${action} la categoría "${item.description}"?\n\n${consequence}\n\n¿Deseas continuar?`
        );

        if (confirmed) {
            try {
                setError('');
                await categoryService.deactivate(item.id);
                await loadCategories();
                const message = hasProducts
                    ? 'Categoría desactivada exitosamente'
                    : 'Categoría eliminada exitosamente';
                setSuccessMessage(message);
            } catch (error) {
                console.error('Error al procesar:', error);
                setError(error.message || `Error al ${action} la categoría`);
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadCategories();
        setRecentlyUpdated(savedItem.id);

        const message = isEdit
            ? 'Categoría actualizada exitosamente'
            : 'Categoría creada exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Cargando categorías...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
                <button
                    onClick={handleCreate}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nueva Categoría
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Productos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay categorías registradas
                                </td>
                            </tr>
                        ) : (
                            categories.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === item.id ? 'bg-green-50 border-l-4 border-green-400' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                (item.number_of_products || 0) > 0
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {item.number_of_products || 0} productos
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.active && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className={`${
                                                    (item.number_of_products || 0) > 0
                                                        ? 'text-orange-600 hover:text-orange-900'
                                                        : 'text-red-600 hover:text-red-900'
                                                }`}
                                            >
                                                {(item.number_of_products || 0) > 0 ? 'Desactivar' : 'Eliminar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CategoriesForm
                    item={editingItem}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default CategoriesList;
