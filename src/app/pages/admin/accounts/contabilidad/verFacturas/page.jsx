"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(''); // Estado para el filtro de búsqueda
  const router = useRouter();

  useEffect(() => {
    async function fetchFacturas() {
      try {
        const response = await fetch(`/api/factura?nombre=${search}`);
        if (!response.ok) {
          throw new Error('Error al obtener las facturas');
        }
        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFacturas();
  }, [search]); // Vuelve a hacer la petición cuando cambie el filtro de búsqueda

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleViewDetails = (facturaId) => {
    router.push(`/pages/admin/accounts/contabilidad/detalles/${facturaId}`);
  };

  const handleEliminar = async (facturaId) => {
    try {
      const response = await fetch(`/api/factura/${facturaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la factura');
      }
      alert('Factura eliminada con éxito');
      setFacturas((prev) => prev.filter((factura) => factura.id !== facturaId));
    } catch (error) {
      alert('Hubo un problema al eliminar la factura: ' + error.message);
    }
  };

  const handleBack = () => {
    router.push('/pages/admin/accounts/contabilidad');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl p-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800">Lista de Facturas</h2>
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
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre del Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
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
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{factura.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{factura.empleadoNombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {factura.total.toLocaleString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(factura.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(factura.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => handleEliminar(factura.id)}
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

