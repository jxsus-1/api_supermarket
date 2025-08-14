import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { categoryService } from '../services';

const CategoriesForm = ({ item, onSuccess, onCancel }) => {
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

        // Validaciones
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!formData.description.trim()) {
            setError('La descripción es requerida');
            return;
        }

        const pattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!pattern.test(formData.name) || !pattern.test(formData.description)) {
            setError('Solo se permiten letras, números, espacios, apostrofes y guiones');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
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
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar la categoría');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
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
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Ej: Bebidas, Dulces, Lácteos"
                                maxLength="100"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción *
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Ej: Bebidas refrescantes, Snacks"
                                maxLength="100"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Activa
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesForm;
