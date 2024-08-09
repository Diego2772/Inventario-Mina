"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditEmployee() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Obtenemos el id desde los parámetros de la URL
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
  });

  useEffect(() => {
    if (id) {
      fetchEmployee(id); // Solo hacemos la llamada a la API si el id está disponible
    }
  }, [id]);

  const fetchEmployee = async (employeeId) => {
    try {
      const res = await fetch(`/api/employs/${employeeId}`);
      if (!res.ok) {
        throw new Error('Error al obtener el empleado');
      }
      const data = await res.json();
      setEmployee(data);
      setFormData({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al obtener el empleado');
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
      const res = await fetch(`/api/employs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Error al actualizar el empleado');
      }
      const updatedEmployee = await res.json();
      router.push('/pages/admin/employees');
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al actualizar el empleado');
    }
  };

  if (!id) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Editar Empleado</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {employee ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cédula</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                required
              />
            </div>
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
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
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
          <p className="text-center text-gray-500">Cargando datos del empleado...</p>
        )}
      </div>
    </div>
  );
}
