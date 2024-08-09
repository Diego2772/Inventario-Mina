// pages/admin/accounts.js
import Link from 'next/link';

export default function Accounts() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Cuentas</h1>
        <Link href="/pages/admin" className="block p-6 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Volver al Panel de Administrador
        </Link>
      </div>
    </div>
  );
}
