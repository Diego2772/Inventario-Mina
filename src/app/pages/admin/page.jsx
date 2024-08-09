// pages/admin.js
import Link from 'next/link';

export default function Admin() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Panel de Administrador</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/pages/admin/employees" legacyBehavior>
            <a className="block p-6 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Empleados
            </a>
          </Link>
          <Link href="/pages/admin/products" legacyBehavior>
            <a className="block p-6 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Productos
            </a>
          </Link>
          <Link href="/pages/admin/accounts" legacyBehavior>
            <a className="block p-6 text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Cuentas
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

