"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditTrabajo() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Obtenemos el id desde los parámetros de la URL
  const [trabajo, setTrabajo] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    empleadoId: '',
  });
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    if (id) {
      fetchTrabajo(id); // Solo hacemos la llamada a la API si el id está disponible
      fetchEmpleados();
    }
  }, [id]);

  const fetchTrabajo = async (trabajoId) => {
    try {
      const res = await fetch(`/api/trabajos/${trabajoId}`);
      if (!res.ok) {
        throw new Error('Error al obtener el trabajo');
      }
      const data = await res.json();
      setTrabajo(data);
      setFormData({
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: data.precio,
        empleadoId: data.empleadoId,
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al obtener el trabajo');
    }
  };

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('/api/employs/all');
      if (!res.ok) {
        throw new Error('Error al obtener los empleados');
      }
      const data = await res.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al obtener los empleados');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/trabajos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Error al actualizar el trabajo');
      }
      router.push('/pages/admin/accounts/trabajos/verTrabajos'); // Redirigir a la lista de trabajos
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al actualizar el trabajo');
    }
  };

  const handleBack = () => {
    router.push('/pages/admin/accounts/trabajos/verTrabajos'); // Redirigir a la lista de trabajos
  };

  if (!id) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Editar Trabajo</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {trabajo ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Empleado</label>
              <select
                name="empleadoId"
                value={formData.empleadoId}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
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
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Volver
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-500">Cargando datos del trabajo...</p>
        )}
      </div>
    </div>
  );
}
