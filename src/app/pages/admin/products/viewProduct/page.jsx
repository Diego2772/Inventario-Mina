"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products/all?nombre=${search}`);
        if (!res.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Hubo un problema al obtener los productos');
      }
    }

    fetchProducts();
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al eliminar el producto');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Lista de Productos</h1>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={handleSearchChange}
          className="block w-full p-4 mb-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos registrados.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-6 space-y-4 bg-gray-50 rounded-lg shadow-sm">
              <p><strong>Nombre:</strong> {product.nombre}</p>
              <p><strong>Cantidad:</strong> {product.cantidad}</p>
              <p><strong>Precio:</strong> ${product.precio}</p>
              <div className="flex space-x-4">
                <Link href={`/pages/admin/products/edit/${product.id}`}>
                  <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Editar</button>
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
        <div className="flex space-x-4">
          <Link href="/pages/admin/products/createProduct">
            <button className="block w-full p-6 mt-6 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Crear Producto
            </button>
          </Link>
          <Link href="/pages/admin/products">
            <button className="block w-full p-6 mt-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Volver
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
