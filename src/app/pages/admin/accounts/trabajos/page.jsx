"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTrabajo() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
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
      const response = await fetch('/api/trabajos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          precio: parseInt(precio), // Asegurarse de que sea un número
          empleadoId: parseInt(empleadoId), // Asegurarse de que sea un número
        }),
      });

      if (response.ok) {
        alert('Trabajo creado exitosamente');
        router.push('/trabajos/verTrabajos'); // Redirige a la lista de trabajos
      } else {
        alert('Error al crear el trabajo');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un problema al intentar crear el trabajo.');
    }
  };

  const handleVerTrabajos = () => {
    router.push('/pages/admin/accounts/trabajos/verTrabajos'); // Redirige a la página de la lista de trabajos
  };

  const handleBack = () => {
    router.push('/pages/admin/accounts'); // Redirige a la página principal de trabajos
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Nuevo Trabajo</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Ingrese el título"
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
            ></textarea>
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              name="precio"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Ingrese el precio"
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

          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Trabajo
            </button>
            <button
              type="button"
              onClick={handleVerTrabajos}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver Trabajos
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={handleBack}
          className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-600 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
