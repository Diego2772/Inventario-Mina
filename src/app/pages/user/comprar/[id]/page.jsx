"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ComprarProducto({ params }) {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Obtener la información del producto
    const fetchProducto = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        setProducto(data);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    // Obtener la lista de empleados al cargar la página
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('/api/employs/all');
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    };

    fetchProducto();
    fetchEmpleados();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (parseInt(cantidad) > producto.cantidad) {
      alert('La cantidad solicitada excede la cantidad disponible.');
      return;
    }
  
    try {
      const response = await fetch('/api/consumos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cantidad: parseInt(cantidad),
          productoId: producto.id,
          empleadoId: parseInt(empleadoId),
          estado: 'Pendiente',
        }),
      });
  
      if (response.ok) {
        // Actualizar el stock del producto en la base de datos
        await fetch(`/api/products/${producto.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cantidad: producto.cantidad - parseInt(cantidad),
          }),
        });
        
        alert('Compra realizada exitosamente');
        router.push('/pages/user/');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un problema al intentar realizar la compra.');
    }
  };

  const handleBack = () => {
    router.push('/pages/user/'); // Redirige a la página principal
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Comprar Producto</h2>
        {producto && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p><strong>Producto:</strong> {producto.nombre}</p>
            </div>

            <div>
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                id="cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Ingrese la cantidad"
                required
              />
            </div>

            <div>
              <label htmlFor="empleadoId" className="block text-sm font-medium text-gray-700">
                Empleado
              </label>
              <select
                name="empleadoId"
                id="empleadoId"
                value={empleadoId}
                onChange={(e) => setEmpleadoId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="" disabled>
                  Seleccione un empleado
                </option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
