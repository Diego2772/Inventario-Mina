// pages/api/employs/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const vale = await prisma.vale.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json(vale);
    } catch (error) {
        console.error('Error al obtener el vale:', error);
        return NextResponse.json({ error: 'Hubo un problema al obtener el vale' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const data = await request.json();
    try {
        const updatedVale = await prisma.vale.update({
            where: { id: Number(id) },
            data,
        });
        return NextResponse.json(updatedVale);
    } catch (error) {
        console.error('Error al actualizar el vale:', error);
        return NextResponse.json({ error: 'Hubo un problema al actualizar el vale' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const deletedvale = await prisma.vale.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(deletedvale);
    } catch (error) {
        console.error('Error al eliminar el vale:', error);
        return NextResponse.json({ error: 'Hubo un problema al eliminar el vale' }, { status: 500 });
    }
}