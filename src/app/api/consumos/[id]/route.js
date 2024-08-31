// pages/api/employs/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(request, { params }) {
    const { id } = params;
    try {
        const consumo = await prisma.consumo.findUnique({
            where: { id: Number(id) },
            include: {
                producto: true,
                empleado: true,
            },
        });
        if (!consumo) {
            return NextResponse.json({ error: 'Consumo no encontrado' }, { status: 404 });
        }
        return NextResponse.json(consumo);
    } catch (error) {
        console.error('Error al obtener el consumo:', error);
        return NextResponse.json({ error: 'Hubo un problema al obtener el consumo' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const deletedConsumo = await prisma.consumo.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(deletedConsumo);
    } catch (error) {
        console.error('Error al eliminar el consumo:', error);
        return NextResponse.json({ error: 'Hubo un problema al eliminar el consumo' }, { status: 500 });
    }
}
