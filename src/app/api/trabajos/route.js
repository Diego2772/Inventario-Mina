import { NextResponse } from "next/server";
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, descripcion, precio, estado = "false", empleadoId, facturaId = null } = body;

    const newTrabajo = await prisma.trabajo.create({
      data: {
        titulo,
        descripcion,
        precio,
        estado,
        empleado: {
          connect: { id: empleadoId }
        },
        factura: facturaId ? { connect: { id: facturaId } } : undefined
      },
    });

    return NextResponse.json(newTrabajo);
  } catch (error) {
    console.error("Error al crear el trabajo:", error);
    return NextResponse.json(
      { error: "Hubo un problema al crear el trabajo desde la API.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get('nombre');

    const trabajos = await prisma.trabajo.findMany({
      where: {
        empleado: {
          nombre: {
            contains: nombre,
          },
        },
      },
      include: {
        empleado: true,
      },
      orderBy: {
        createdAt: 'desc', // Ordenar por fecha de creación, más reciente primero
      },
    });

    return NextResponse.json(trabajos);
  } catch (error) {
    console.error('Error al obtener los trabajos:', error);
    return NextResponse.json({ error: 'Hubo un problema al obtener los trabajos' }, { status: 500 });
  }
}