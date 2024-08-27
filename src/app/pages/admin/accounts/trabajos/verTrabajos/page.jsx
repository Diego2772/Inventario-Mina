"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrabajosList() {
  const [trabajos, setTrabajos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Obtener la lista de trabajos y empleados al cargar la página
    const fetchTrabajos = async () => {
      try {
        const response = await fetch('/api/trabajos');
        const data = await response.json();
        setTrabajos(data);
      } catch (error) {
        console.error('Error al obtener los trabajos:', error);
      }
    };

    const fetchEmpleados = async () => {
      try {
        const response = await fetch('/api/employs/all');
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    };

    fetchTrabajos();
    fetchEmpleados();
  }, []);

  const handleEdit = (id) => {
    // Redirigir a la página de edición del trabajo
    router.push(`/pages/admin/accounts/trabajos/edit/${id}`);
  };

  const handleDelete = async (id) => {
    // Confirmar antes de eliminar
    if (confirm('¿Estás seguro de que quieres eliminar este trabajo?')) {
      try {
        const response = await fetch(`/api/trabajos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Trabajo eliminado exitosamente');
          // Actualizar la lista de trabajos
          setTrabajos(trabajos.filter((trabajo) => trabajo.id !== id));
        } else {
          alert('Error al eliminar el trabajo');
        }
      } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
        alert('Hubo un problema al intentar eliminar el trabajo.');
      }
    }
  };

  // Función para obtener el nombre del empleado por ID
  const getEmpleadoNombre = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? empleado.nombre : 'Desconocido';
  };

  // Función para obtener el estado formateado
  const getEstadoTexto = (estado) => (estado ? 'Por cuadrar' : 'Cuadrado');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg overflow-auto">
        <button
          onClick={() => router.push('/pages/admin/accounts/trabajos')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800">Lista de Trabajos</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trabajos.map((trabajo) => (
              <tr key={trabajo.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{trabajo.titulo}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {trabajo.descripcion}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {getEmpleadoNombre(trabajo.empleadoId)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {getEstadoTexto(trabajo.estado)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(trabajo.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(trabajo.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

