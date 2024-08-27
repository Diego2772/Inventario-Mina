
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const trabajo = await prisma.trabajo.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json(trabajo);
    } catch (error) {
        console.error('Error al obtener el trabajo:', error);
        return NextResponse.json({ error: 'Hubo un problema al obtener el trabajo' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const data = await request.json();
    try {
        const updatedTrabajo = await prisma.trabajo.update({
            where: { id: Number(id) },
            data,
        });
        return NextResponse.json(updatedTrabajo);
    } catch (error) {
        console.error('Error al actualizar el trabajo:', error);
        return NextResponse.json({ error: 'Hubo un problema al actualizar el trabajo' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const deletedTrabajo = await prisma.trabajo.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(deletedTrabajo);
    } catch (error) {
        console.error('Error al eliminar el trabajo:', error);
        return NextResponse.json({ error: 'Hubo un problema al eliminar el trabajo' }, { status: 500 });
    }
}