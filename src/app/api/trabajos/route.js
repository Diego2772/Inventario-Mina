// /pages/api/trabajos/create.js
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { titulo, descripcion, precio, empleadoId, facturaId } = req.body;

    try {
      const newTrabajo = await prisma.trabajo.create({
        data: {
          titulo,
          descripcion,
          precio: parseInt(precio, 10),
          estado: "false", // Set estado as "false" by default
          empleado: {
            connect: { id: parseInt(empleadoId, 10) },
          },
          factura: facturaId ? { connect: { id: parseInt(facturaId, 10) } } : undefined,
        },
      });
      res.status(201).json(newTrabajo);
    } catch (error) {
      console.error("Error creando el trabajo: ", error);
      res.status(500).json({ error: 'Error creando el trabajo' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
