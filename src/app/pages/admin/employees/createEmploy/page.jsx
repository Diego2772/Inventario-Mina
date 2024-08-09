"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function CreateEmployee() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, cedula, telefono,} = form;

    try {
      const res = await fetch('/api/employs', {
        method: 'POST',
        body: JSON.stringify({ nombre, apellido, cedula, telefono }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Error al enviar los datos');
      }

      const data = await res.json();
      console.log(data);
      setSuccess('Empleado creado exitosamente');
      setForm({
        nombre: '',
        apellido: '',
        cedula: '',
        telefono: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al crear el empleado');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Crear Empleado</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              id="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              id="cedula"
              value={form.cedula}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              id="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear Empleado
          </button>
        </form>
        <Link href="/pages/admin/employees" className="block p-6 mt-6 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Volver a Empleados
        </Link>
      </div>
    </div>
  );
}
