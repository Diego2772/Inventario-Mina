import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { empleadoId } = await request.json();

    // Buscar registros donde estado = 'false'
    const trabajos = await prisma.trabajo.findMany({
      where: { empleadoId, estado: 'false' },
    });

    const vales = await prisma.vale.findMany({
      where: { empleadoId, estado: 'false' },
    });

    const consumos = await prisma.consumo.findMany({
      where: { empleadoId, estado: 'false' },
    });

    // Verificar si hay registros para procesar
    if (trabajos.length === 0 && vales.length === 0 && consumos.length === 0) {
      return NextResponse.json(
        { error: "No hay trabajos, vales ni consumos para crear una factura." },
        { status: 400 }
      );
    }

    // Calcular el total de la factura
    const totalTrabajos = trabajos.reduce((acc, trabajo) => acc + trabajo.precio, 0);
    const totalVales = vales.reduce((acc, vale) => acc + vale.cantidad, 0);
    const totalConsumos = consumos.reduce((acc, consumo) => acc + consumo.cantidad, 0);

    const totalFactura = totalTrabajos - totalVales - totalConsumos;

    // Crear el registro en la tabla Factura
    const factura = await prisma.factura.create({
      data: {
        empleadoId,
        trabajos: {
          connect: trabajos.map((trabajo) => ({ id: trabajo.id })),
        },
        vales: {
          connect: vales.map((vale) => ({ id: vale.id })),
        },
        consumos: {
          connect: consumos.map((consumo) => ({ id: consumo.id })),
        },
        total: totalFactura,
      },
    });

    // Actualizar el estado de los registros a 'true'
    await prisma.trabajo.updateMany({
      where: { empleadoId, estado: 'false' },
      data: { estado: 'true', facturaId: factura.id },
    });

    await prisma.vale.updateMany({
      where: { empleadoId, estado: 'false' },
      data: { estado: 'true', facturaId: factura.id },
    });

    await prisma.consumo.updateMany({
      where: { empleadoId, estado: 'false' },
      data: { estado: 'true', facturaId: factura.id },
    });

    return NextResponse.json({ message: 'Factura creada con éxito', factura });
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return NextResponse.json(
      { error: "Hubo un problema al crear la factura.", details: error.message },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get('nombre');

    const facturas = await prisma.factura.findMany({
      where: {
        empleado: {
          nombre: {
            contains: nombre,
          },
        },
      },
      include: {
        trabajos: true,
        vales: true,
        consumos: true,
        empleado: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Ordenar por fecha de creación, más reciente primero
      },
    });

    // Mapear facturas para incluir el nombre del empleado en lugar del empleadoId
    const facturasConNombre = facturas.map(factura => ({
      ...factura,
      empleadoNombre: factura.empleado.nombre,
    }));

    return NextResponse.json(facturasConNombre);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    return NextResponse.json(
      { error: "Hubo un problema al obtener las facturas.", details: error.message },
      { status: 500 }
    );
  }
}