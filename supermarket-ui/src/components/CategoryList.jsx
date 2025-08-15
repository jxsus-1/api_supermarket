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

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    if (!validateToken()) return;
    try {
      setLoading(true);
      setError('');
      const data = await categoryService.getAll();

      // Convertimos active a booleano robustamente
      const mappedData = data.map(cat => ({
        ...cat,
        active: cat.active === true || cat.active === 'true' || cat.active === 1
      }));

      setCategories(mappedData);
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

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-4 text-center text-gray-500">
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categories.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 transition-colors`}>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      (item.number_of_products || 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.number_of_products || 0} productos
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
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
