import Link from 'next/link';

export default function user() {
  return (
    <div>
      <h1>Bienvenido Usuario</h1>
      <Link href="/">Volver a la página de inicio</Link>
    </div>
  );
}