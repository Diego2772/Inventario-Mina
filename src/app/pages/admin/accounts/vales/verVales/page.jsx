"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValesList() {
  const [vales, setVales] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchVales = async () => {
      try {
        const response = await fetch(`/api/vales?nombre=${search}`);
        const data = await response.json();
        setVales(data);
      } catch (error) {
        console.error('Error al obtener los vales:', error);
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

    fetchVales();
    fetchEmpleados();
  }, [search]);

  const handleEdit = (id) => {
    router.push(`/pages/admin/accounts/vales/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vale?')) {
      try {
        const response = await fetch(`/api/vales/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Vale eliminado exitosamente');
          setVales(vales.filter((vale) => vale.id !== id));
        } else {
          alert('Error al eliminar el vale');
        }
      } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
        alert('Hubo un problema al intentar eliminar el vale.');
      }
    }
  };

  const getEmpleadoNombre = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? empleado.nombre : 'Desconocido';
  };

  const getEstadoTexto = (estado) => (estado ? 'Por cuadrar' : 'Cuadrado');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Lista de Vales</h2>
        <input
          type="text"
          placeholder="Buscar por nombre de empleado"
          value={search}
          onChange={handleSearchChange}
          className="block w-full p-4 mb-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vales.map((vale) => (
              <tr key={vale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vale.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vale.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getEmpleadoNombre(vale.empleadoId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getEstadoTexto(vale.estado)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(vale.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(vale.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vale.id)}
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
