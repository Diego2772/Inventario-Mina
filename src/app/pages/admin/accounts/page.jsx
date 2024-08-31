// /pages/admin/accounts.js
import Link from 'next/link';

export default function Accounts() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Cuentas</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Link href="/pages/admin/accounts/vales" className="block p-6 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Vales
          </Link>

          <Link href="/pages/admin/accounts/trabajos" className="block p-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Trabajos
          </Link>

          <Link href="/pages/admin/accounts/consumos" className="block p-6 text-center text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
            Consumos
          </Link>

          <Link href="/pages/admin/accounts/contabilidad" className="block p-6 text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Contabilidad
          </Link>
        </div>

        <Link href="/pages/admin" className="block p-6 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Volver al Panel de Administrador
        </Link>
      </div>
    </div>
  );
}

