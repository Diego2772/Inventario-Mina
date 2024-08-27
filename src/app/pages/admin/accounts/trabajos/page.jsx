"use client"
// /pages/trabajos/create.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTrabajo() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [facturaId, setFacturaId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/trabajos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo,
        descripcion,
        precio,
        empleadoId,
        facturaId: facturaId || null,
      }),
    });

    if (response.ok) {
      alert('Trabajo creado exitosamente');
      router.push('/trabajos');
    } else {
      alert('Error al crear el trabajo');
    }
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
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Crear Trabajo
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}

