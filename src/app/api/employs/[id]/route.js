// pages/api/employs/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const employee = await prisma.employ.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json(employee);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        return NextResponse.json({ error: 'Hubo un problema al obtener el empleado' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const data = await request.json();
    try {
        const updatedEmployee = await prisma.employ.update({
            where: { id: Number(id) },
            data,
        });
        return NextResponse.json(updatedEmployee);
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        return NextResponse.json({ error: 'Hubo un problema al actualizar el empleado' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const deletedEmployee = await prisma.employ.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(deletedEmployee);
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        return NextResponse.json({ error: 'Hubo un problema al eliminar el empleado' }, { status: 500 });
    }
}