"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EmpleadosList() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('/api/employs');
        if (!response.ok) {
          throw new Error('Error al obtener los empleados');
        }
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  async function handlePagar(empleadoId) {
    try {
      const response = await fetch('/api/factura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empleadoId }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(result.error || 'Error al crear la factura.');
      } else {
        alert('Factura creada con éxito');
        // Opcionalmente, podrías redirigir o actualizar la interfaz gráfica
      }
    } catch (error) {
      alert('Error en la solicitud: ' + error.message);
    }
  }

  const handleBack = () => {
    // Redirige a la página principal o a otra página que desees
    router.push('/pages/admin/accounts'); // Cambia '/' por la ruta a la que deseas volver
  };

  const handleViewFacturas = () => {
    // Redirige a la página de lista de facturas
    router.push('/pages/admin/accounts/contabilidad/verFacturas'); // Cambia '/facturas' por la ruta a la que se debe redirigir para ver las facturas
  };

  if (loading) return <p className="text-center text-gray-500">Cargando empleados...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
          <button
            onClick={handleViewFacturas}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ver Facturas
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Lista de Empleados</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Factura</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empleado.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empleado.ultimaFactura?.createdAt ? new Date(empleado.ultimaFactura.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handlePagar(empleado.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Pagar
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
