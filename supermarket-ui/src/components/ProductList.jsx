import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ item, categories, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        category_id: item?.category_id || '',
        name: item?.name || '',
        description: item?.description || '',
        image: item?.image || '',
        price: item?.price || '',
        discount: item?.discount || 0,
        stock: item?.stock || 0
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();
    const navigate = useNavigate();

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

        if (!formData.category_id.trim()) { setError('La categoría es requerida'); return; }
        if (!formData.name.trim()) { setError('El nombre es requerido'); return; }
        const namePattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!namePattern.test(formData.name)) { setError('El nombre solo puede contener letras, números, espacios, apostrofes y guiones'); return; }
        if (!formData.description.trim()) { setError('La descripción es requerida'); return; }
        if (!formData.image.trim()) { setError('La URL de la imagen es requerida'); return; }
        if (!formData.price || parseFloat(formData.price) <= 0) { setError('El precio debe ser mayor a 0'); return; }
        const discount = parseInt(formData.discount) || 0;
        if (discount < 0 || discount > 100) { setError('El descuento debe estar entre 0 y 100'); return; }
        if (formData.stock < 0) { setError('El stock no puede ser negativo'); return; }

        setIsSubmitting(true);
        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await productService.update(item.id, formData);
                if (!savedItem) savedItem = { ...item, ...formData };
                onSuccess(savedItem, true);
            } else {
                savedItem = await productService.create(formData);
                if (!savedItem) savedItem = { id: Date.now().toString(), ...formData };
                onSuccess(savedItem, false);
            }

            navigate('/products');

        } catch (err) {
            console.error('Error al guardar producto:', err);
            setError(err.message || 'Error al guardar el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    const activeCategories = categories;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-yellow-500 mb-4">
                        {item ? 'Editar Producto' : 'Nuevo Producto'}
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
                        {/* Categoría */}
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-yellow-700 mb-1">
                                Categoría *
                            </label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                required
                            >
                                <option value="">Seleccionar categoría...</option>
                                {activeCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="text-black">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-yellow-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                placeholder="Ej: Balón Oficial 2025"
                                maxLength="100"
                                autoFocus={!item}
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-yellow-700 mb-1">
                                Descripción *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                placeholder="Descripción del producto..."
                                maxLength="500"
                            />
                        </div>

                        {/* Imagen */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-yellow-700 mb-1">
                                URL de Imagen *
                            </label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                placeholder="https://ejemplo.com/producto.jpg"
                            />
                        </div>

                        {/* Precio y Descuento */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-yellow-700 mb-1">
                                    Precio (HNL) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label htmlFor="discount" className="block text-sm font-medium text-yellow-700 mb-1">
                                    Descuento (%)
                                </label>
                                <input
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-yellow-700 mb-1">
                                Stock *
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black"
                                placeholder="Cantidad en inventario"
                                min="0"
                            />
                        </div>

                        {/* Vista de precio con descuento */}
                        {formData.price && formData.discount > 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <div className="text-sm text-yellow-800"><strong>Precio con descuento:</strong></div>
                                <div className="text-lg font-medium text-yellow-900">
                                    <span className="line-through text-gray-500 mr-2">
                                        L. {parseFloat(formData.price).toFixed(2)}
                                    </span>
                                    L. {(parseFloat(formData.price) * (1 - formData.discount / 100)).toFixed(2)}
                                    <span className="text-sm text-yellow-700 ml-2">({formData.discount}% descuento)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-200 hover:bg-yellow-300 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
