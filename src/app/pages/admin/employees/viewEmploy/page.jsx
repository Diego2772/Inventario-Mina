"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch(`https://inventario-mina.vercel.app/api/employs/all?nombre=${search}`);
        if (!res.ok) {
          throw new Error('Error al obtener los empleados');
        }
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Hubo un problema al obtener los empleados');
      }
    }

    fetchEmployees();
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    const isConfirmed = confirm('¿Estás seguro de que deseas eliminar este empleado?');
    
    if (!isConfirmed) {
      return;
    }

    try {
      const res = await fetch(`https://inventario-mina.vercel.app/api/employs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar el empleado');
      }

      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al eliminar el empleado');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Lista de Empleados</h1>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={handleSearchChange}
          className="block w-full p-4 mb-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No hay empleados registrados.</p>
        ) : (
          employees.map((employee) => (
            <div key={employee.id} className="p-6 space-y-4 bg-gray-50 rounded-lg shadow-sm">
              <p><strong>Cédula:</strong> {employee.cedula}</p>
              <p><strong>Nombre:</strong> {employee.nombre}</p>
              <p><strong>Apellido:</strong> {employee.apellido}</p>
              <p><strong>Teléfono:</strong> {employee.telefono}</p>
              <p><strong>Fecha de Inicio:</strong> {new Date(employee.createdAt).toLocaleDateString()}</p>
              <div className="flex space-x-4">
                <Link href={`/pages/admin/employees/edit/${employee.id}`}>
                  <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Editar</button>
                </Link>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
        <div className="flex space-x-4">
          <Link href="/pages/admin/employees/createEmploy">
            <button className="block w-full p-6 mt-6 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Crear Empleado
            </button>
          </Link>
          <Link href="/pages/admin/employees">
            <button className="block w-full p-6 mt-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Volver
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}