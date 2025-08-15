import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { categoryService } from '../services';

const CategoryForm = ({ item, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    active: item?.active ?? true
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateToken } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateToken()) return;

    if (!formData.name.trim()) { setError('El nombre es requerido'); return; }
    if (!formData.description.trim()) { setError('La descripción es requerida'); return; }

    const pattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
    if (!pattern.test(formData.name) || !pattern.test(formData.description)) {
      setError('Solo se permiten letras, números, espacios, apostrofes y guiones');
      return;
    }

    setIsSubmitting(true);
    try {
      let savedItem;
      if (item) {
        savedItem = await categoryService.update(item.id, formData);
        if (!savedItem) savedItem = { ...item, ...formData };
        onSuccess(savedItem, true);
      } else {
        savedItem = await categoryService.create(formData);
        if (!savedItem) savedItem = { id: Date.now(), ...formData };
        onSuccess(savedItem, false);
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err.message || 'Error al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;

    try {
      await categoryService.delete(item.id);
      onSuccess(item, true);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError(err.message || 'Error al eliminar la categoría');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {item ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <div className="flex items-center">
                <span className="mr-2">❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Activo</label>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            {item && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
              >
                {item ? 'Actualizar' : 'Guardar'}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
