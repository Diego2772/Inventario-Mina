import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
      console.log("Inicio de la eliminación del consumo con ID:", id);
      
      const consumo = await prisma.consumo.findUnique({
        where: { id: Number(id) },
        include: { producto: true },
      });
  
      if (!consumo) {
        console.log("Consumo no encontrado.");
        return NextResponse.json({ error: 'Consumo no encontrado' }, { status: 404 });
      }
  
      await prisma.consumo.delete({
        where: { id: Number(id) },
      });
  
      console.log("Consumo eliminado, actualizando la cantidad del producto...");
  
      await prisma.product.update({
        where: { id: consumo.productoId },
        data: {
          cantidad: {
            increment: consumo.cantidad,
          },
        },
      });
  
      console.log("Cantidad del producto restaurada correctamente.");
      return NextResponse.json({ message: 'Consumo eliminado y cantidad del producto restaurada correctamente' });
    } catch (error) {
      console.error('Error al eliminar el consumo:', error);
      return NextResponse.json({ error: 'Hubo un problema al eliminar el consumo' }, { status: 500 });
    }
  }
  