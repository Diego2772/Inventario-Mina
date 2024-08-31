import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; // Asegúrate de tener prisma importado

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get('nombre');

    const consumos = await prisma.consumo.findMany({
      where: nombre
        ? {
            empleado: {
              nombre: {
                contains: nombre,
              },
            },
          }
        : {},
      include: {
        producto: true,
        empleado: true,
        factura: true,
      },
      orderBy: {
        createdAt: 'desc', // Ordenar por fecha de creación, más reciente primero
      },
    });

    return NextResponse.json(consumos);
  } catch (error) {
    console.error('Error al obtener los consumos:', error);
    return NextResponse.json(
      { error: 'Hubo un problema al obtener los consumos' },
      { status: 500 }
    );
  }
}

  export async function POST(request) {
    try {
      const { cantidad, productoId, empleadoId } = await request.json();
  
      // Obtener el producto actual
      const producto = await prisma.product.findUnique({
        where: { id: productoId },
      });
  
      if (!producto) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
  
      // Verificar si hay suficiente cantidad disponible
      if (producto.cantidad < cantidad) {
        return NextResponse.json({ error: 'Cantidad insuficiente en stock' }, { status: 400 });
      }
  
      // Restar la cantidad comprada del stock
      const nuevaCantidad = producto.cantidad - cantidad;
  
      // Actualizar la cantidad del producto en la base de datos
      await prisma.product.update({
        where: { id: productoId },
        data: { cantidad: nuevaCantidad },
      });
  
      // Crear el registro de consumo
      const nuevoConsumo = await prisma.consumo.create({
        data: {
          cantidad,
          productoId,
          empleadoId,
          estado: 'false', // Puedes ajustar el estado según tu lógica
        },
      });
  
      return NextResponse.json(nuevoConsumo);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      return NextResponse.json({ error: 'Hubo un problema al procesar la compra' }, { status: 500 });
    }
  }

