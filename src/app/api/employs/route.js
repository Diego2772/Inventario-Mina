import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { cedula, nombre, apellido, telefono } = body;

    const newEmploy = await prisma.employ.create({
      data: {
        cedula,
        nombre,
        apellido,
        telefono,
      },
    });

    return NextResponse.json(newEmploy);
  } catch (error) {
    console.error("Error al crear el empleado:", error);
    return NextResponse.json(
      { error: "Hubo un problema al crear el empleado desde la API", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const empleados = await prisma.employ.findMany({
      include: {
        facturas: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const empleadosConUltimaFactura = empleados.map((empleado) => ({
      ...empleado,
      ultimaFactura: empleado.facturas[0] || null,
    }));

    return NextResponse.json(empleadosConUltimaFactura);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return NextResponse.json(
      { error: "Hubo un problema al obtener los empleados.", details: error.message },
      { status: 500 }
    );
  }
}