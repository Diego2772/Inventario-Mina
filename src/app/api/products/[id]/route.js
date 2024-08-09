// pages/api/employs/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        return NextResponse.json({ error: 'Hubo un problema al obtener el producto' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const data = await request.json();
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data,
        });
        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return NextResponse.json({ error: 'Hubo un problema al actualizar el producto' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const deletedProduct = await prisma.product.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(deletedProduct);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return NextResponse.json({ error: 'Hubo un problema al eliminar el producto' }, { status: 500 });
    }
}

