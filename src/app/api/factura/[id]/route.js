import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const facturaId = url.pathname.split('/').pop(); // Obtiene el ID desde la URL

    if (!facturaId) {
      return NextResponse.json({ error: 'ID de factura no proporcionado' }, { status: 400 });
    }

    const parsedFacturaId = parseInt(facturaId, 10);
    if (isNaN(parsedFacturaId)) {
      return NextResponse.json({ error: 'ID de factura inválido' }, { status: 400 });
    }

    // Desconectar trabajos, vales, y consumos de la factura
    await prisma.trabajo.updateMany({
      where: { facturaId: parsedFacturaId },
      data: { facturaId: null, estado: 'false' },
    });

    await prisma.vale.updateMany({
      where: { facturaId: parsedFacturaId },
      data: { facturaId: null, estado: 'false' },
    });

    await prisma.consumo.updateMany({
      where: { facturaId: parsedFacturaId },
      data: { facturaId: null, estado: 'false' },
    });

    // Eliminar la factura
    await prisma.factura.delete({ where: { id: parsedFacturaId } });

    return NextResponse.json({ message: 'Factura eliminada con éxito' });
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    return NextResponse.json(
      { error: "Hubo un problema al eliminar la factura.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params; // Obtenemos el ID de los parámetros de la URL

    // Buscar la factura por ID e incluir relaciones con trabajos, vales y consumos
    const factura = await prisma.factura.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        trabajos: true,
        vales: true,
        consumos: {
          include: {
            producto: true, // Asumiendo que tienes una relación con la tabla de productos
          },
        },
        empleado: true, // Asumiendo que la factura tiene un campo empleado con nombre
      },
    });

    if (!factura) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }

    // Mapear los datos para incluir nombres en lugar de IDs
    const facturaConDetalles = {
      ...factura,
      empleadoNombre: factura.empleado.nombre, // Asumiendo que el nombre del empleado está en la relación
      consumos: factura.consumos.map(consumo => ({
        ...consumo,
        nombreProducto: consumo.producto.nombre, // Asumiendo que el nombre del producto está en la relación
        valor: consumo.cantidad * consumo.producto.precio, // Suponiendo que tienes el precio en el producto
      })),
    };

    return NextResponse.json(facturaConDetalles);
  } catch (error) {
    console.error('Error al obtener la factura:', error);
    return NextResponse.json(
      { error: 'Hubo un problema al obtener la factura.', details: error.message },
      { status: 500 }
    );
  }
}