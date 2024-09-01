"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsumosList() {
  const [consumos, setConsumos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState('');
  const [eliminando, setEliminando] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchConsumos = async () => {
      try {
        const response = await fetch(`/api/consumos?nombre=${search}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setConsumos(data);
        } else {
          console.warn('La respuesta de la API no es un array:', data);
          setConsumos([]);
        }
      } catch (error) {
        console.error('Error al obtener los consumos:', error);
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

    fetchConsumos();
    fetchEmpleados();
  }, [search]);

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este consumo?')) {
      try {
        const response = await fetch(`/api/consumos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Consumo eliminado exitosamente');
          setConsumos(consumos.filter((consumo) => consumo.id !== id));
          setEliminando(null); // Deshacer el estado de eliminación
        } else {
          alert('Error al eliminar el consumo');
        }
      } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
        alert('Hubo un problema al intentar eliminar el consumo.');
      }
    }
  };

  const handleCancelDelete = () => {
    setEliminando(null); // Restablecer estado de eliminación
  };

  const handleBack = () => {
    // Redirige a la página anterior
    router.back();
  };

  const getEmpleadoNombre = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? empleado.nombre : 'Desconocido';
  };

  const getEstadoTexto = (estado) => (estado === 'true' ? 'Cuadrado' : 'Por cuadrar'); // Ajusta el texto según tus necesidades

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDeshacerConsumo = async (id) => {
    try {
      const res = await fetch(`/api/consumos/restaurar/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al restaurar el consumo');
      }

      const data = await res.json();
      console.log(data.message); // Mensaje de confirmación

      // Actualiza la lista eliminando el consumo con el ID especificado
      setConsumos(consumos.filter(consumo => consumo.id !== id));
    } catch (error) {
      console.error('Error al restaurar el consumo:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800">Lista de Consumos</h2>
        </div>
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
                Producto
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
            {consumos.map((consumo) => (
              <tr key={consumo.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consumo.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consumo.producto.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getEmpleadoNombre(consumo.empleadoId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getEstadoTexto(consumo.estado)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(consumo.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {eliminando === consumo.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(consumo.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        Confirmar Eliminación
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeshacerConsumo(consumo.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Deshacer
                      </button>
                      <button
                        onClick={() => setEliminando(consumo.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
