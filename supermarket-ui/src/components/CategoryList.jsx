import { useState, useEffect } from 'react';
import { categoryService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
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
        } catch (err) {
            console.error('Error al cargar categorías:', err);
            setError(err.message || 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;

        try {
            await categoryService.deactivate(id);
            setCategories(categories.filter(cat => cat.id !== id)); 
            setSuccessMessage("Categoría eliminada exitosamente");
        } catch (err) {
            console.error("Error al eliminar categoría:", err);
            setError(err.message || "Error al eliminar la categoría");
        }
    };

    const handleFormSuccess = async (savedCategory, isEdit = false) => {
        await loadCategories();
        setRecentlyUpdated(savedCategory.id);
        const message = isEdit ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setEditingCategory(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCategory(null);
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
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md transition-colors"
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                    No hay categorías registradas
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === category.id ? 'bg-green-50 border-l-4 border-green-400' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-yellow-400 hover:text-yellow-600 mr-2"
                                        >
                                            Editar 
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900"   
                                        >    
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CategoryForm
                    item={editingCategory}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default CategoryList;
