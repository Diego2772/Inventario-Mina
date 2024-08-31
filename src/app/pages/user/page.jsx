"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function EmployeeProductList() {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/">
              <button className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Volver
              </button>
            </Link>
            <Link href="/pages/user/verHistorial">
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Ver Historial
              </button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800">Productos Disponibles</h1>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={handleSearchChange}
          className="block w-full p-4 mb-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-6 space-y-4 bg-gray-50 rounded-lg shadow-sm">
                <p><strong>Nombre:</strong> {product.nombre}</p>
                <p><strong>Cantidad disponible:</strong> {product.cantidad}</p>
                <p><strong>Precio:</strong> ${product.precio}</p>
                <Link href={`/pages/user/comprar/${product.id}`}>
                  <button className="block w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Comprar
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

