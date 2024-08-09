"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    precio: '',
  });

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        throw new Error('Error al obtener el producto');
      }
      const data = await res.json();
      setProduct(data);
      setFormData({
        nombre: data.nombre || '',
        cantidad: data.cantidad || 0,
        precio: data.precio || 0,
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al obtener el producto');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'cantidad' || name === 'precio' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Error al actualizar el producto');
      }
      await res.json();
      router.push('/pages/admin/products/viewProduct');
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al actualizar el producto');
    }
  };

  if (!id) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Editar Producto</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {product ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Actualizar
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-500">Cargando datos del producto...</p>
        )}
      </div>
    </div>
  );
}
