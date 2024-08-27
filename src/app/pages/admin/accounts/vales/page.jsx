"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateVale() {
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const router = useRouter();

  useEffect(() => {
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

    fetchEmpleados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/vales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cantidad: parseInt(cantidad), // Asegurarse de que sea un número
          descripcion,
          empleadoId: parseInt(empleadoId), // Asegurarse de que sea un número
        }),
      });

      if (response.ok) {
        alert('Vale creado exitosamente');
        router.push('/pages/admin/accounts/vales/verVales');
      } else {
        alert('Error al crear el vale');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un problema al intentar crear el vale.');
    }
  };

  const handleVerVales = () => {
    router.push('/pages/admin/accounts/vales/verVales'); // Redirige a la página de vales
  };

  const handleBack = () => {
    router.push('/pages/admin/accounts'); // Redirige a la página de vales
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Nuevo Vale</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Ingrese la descripción"
              required
            ></textarea>
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
              Crear Vale
            </button>
            <button
              type="button"
              onClick={handleVerVales}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver Vales
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
      </div>
    </div>
  );
}

