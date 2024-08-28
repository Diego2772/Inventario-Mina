import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// api/products/all.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get('nombre');

    const products = await prisma.product.findMany({
      where: nombre ? { nombre: { contains: nombre } } : {},
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return NextResponse.json({ error: 'Hubo un problema al obtener los productos' }, { status: 500 });
  }
}
