import { NextResponse } from "next/server";
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { cantidad, descripcion, estado = "false", empleadoId, facturaId = null } = body;

    const newVale = await prisma.vale.create({
      data: {
        cantidad,
        descripcion,
        estado,
        empleado: {
          connect: { id: empleadoId }
        },
        factura: facturaId ? { connect: { id: facturaId } } : undefined
      },
    });

    return NextResponse.json(newVale);
  } catch (error) {
    console.error("Error al crear el vale:", error);
    return NextResponse.json(
      { error: "Hubo un problema al crear el vale desde la API.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get('nombre');

    const vales = await prisma.vale.findMany({
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

    return NextResponse.json(vales);
  } catch (error) {
    console.error('Error al obtener los vales:', error);
    return NextResponse.json({ error: 'Hubo un problema al obtener los vales' }, { status: 500 });
  }
}

