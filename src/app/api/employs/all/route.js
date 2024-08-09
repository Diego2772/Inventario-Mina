// /pages/api/employs/all.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employ.findMany();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    return NextResponse.json({ error: 'Hubo un problema al obtener los empleados' }, { status: 500 });
  }
}
