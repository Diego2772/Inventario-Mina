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

