"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatNumber = (num) => num.toLocaleString('es-ES'); // Formatear números en miles

export default function FacturaDetalles() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [factura, setFactura] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchFactura(id);
    }
  }, [id]);

  const fetchFactura = async (facturaId) => {
    try {
      const res = await fetch(`/api/factura/${facturaId}`);
      if (!res.ok) {
        throw new Error('Error al obtener la factura');
      }
      const data = await res.json();
      setFactura(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un problema al obtener la factura');
    }
  };

  const handleBack = () => {
    router.push('/pages/admin/accounts/contabilidad/verFacturas');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableColumnWidth = (pageWidth - margin * 2) / 3;
    const titleFontSize = 16;
    const contentFontSize = 12;
    const lineHeight = 8;

    // Encabezado de la factura
    doc.setFontSize(titleFontSize);
    doc.text('Detalles de la Factura', pageWidth / 2, margin + lineHeight, { align: 'center' });

    // Información de la Factura
    doc.setFontSize(contentFontSize);
    let y = margin + lineHeight * 3;

    doc.text(`Factura #: ${factura.id}`, margin, y);
    y += lineHeight;
    doc.text(`Empleado: ${factura.empleadoNombre}`, margin, y);
    y += lineHeight;
    doc.text(`Fecha de Creación: ${new Date(factura.createdAt).toLocaleDateString()}`, margin, y);
    y += lineHeight;
    doc.text(`Total: $${formatNumber(factura.total)}`, margin, y);
    y += lineHeight * 2;

    // Trabajos
    doc.setFontSize(titleFontSize);
    doc.text('Trabajos', margin, y);
    y += lineHeight;

    const trabajos = factura.trabajos.map((trabajo) => [trabajo.titulo, `$${formatNumber(trabajo.precio)}`]);
    doc.autoTable({
      startY: y,
      head: [['Descripción', 'Precio']],
      body: trabajos,
      theme: 'striped',
      margin: { left: margin, right: margin },
      columnStyles: { 0: { cellWidth: tableColumnWidth * 2 }, 1: { cellWidth: tableColumnWidth, halign: 'right' } },
      styles: { cellPadding: 3, fontSize: contentFontSize, overflow: 'linebreak', valign: 'middle' },
    });
    y = doc.autoTable.previous.finalY + lineHeight;

    // Vales
    doc.setFontSize(titleFontSize);
    doc.text('Vales', margin, y);
    y += lineHeight;

    const vales = factura.vales.map((vale) => [vale.descripcion, `$${formatNumber(vale.cantidad)}`]);
    doc.autoTable({
      startY: y,
      head: [['Descripción', 'Valor']],
      body: vales,
      theme: 'striped',
      margin: { left: margin, right: margin },
      columnStyles: { 0: { cellWidth: tableColumnWidth * 2 }, 1: { cellWidth: tableColumnWidth, halign: 'right' } },
      styles: { cellPadding: 3, fontSize: contentFontSize, overflow: 'linebreak', valign: 'middle' },
    });
    y = doc.autoTable.previous.finalY + lineHeight;

    // Consumos
    doc.setFontSize(titleFontSize);
    doc.text('Consumos', margin, y);
    y += lineHeight;

    const consumos = factura.consumos.map((consumo) => [
      consumo.nombreProducto,
      formatNumber(consumo.cantidad),
      `$${formatNumber(consumo.valor)}`
    ]);
    
    doc.autoTable({
      startY: y,
      head: [['Producto', 'Cantidad', 'Valor']],
      body: consumos,
      theme: 'striped',
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: tableColumnWidth, halign: 'left' },    // Producto
        1: { cellWidth: tableColumnWidth, halign: 'center' },  // Cantidad, centrado
        2: { cellWidth: tableColumnWidth, halign: 'right' }    // Valor
      },
      styles: { 
        cellPadding: 3, 
        fontSize: contentFontSize, 
        overflow: 'linebreak', 
        valign: 'middle',
        halign: 'center' // Alineación central para celdas
      },
    });
    
    y = doc.autoTable.previous.finalY + lineHeight;
    
    const totalConsumos = factura.consumos.reduce((acc, consumo) => acc + consumo.valor, 0);
    doc.setFontSize(contentFontSize);
    doc.text(`Total Consumido: $${formatNumber(totalConsumos)}`, margin, y);
    

    // Guardar PDF
    doc.save(`factura-${id}.pdf`);
  };

  if (!id) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Cargando...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">{error}</div>;
  }

  if (!factura) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Cargando factura...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div id="factura-content" className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Detalles de la Factura</h2>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Información de la Factura</h3>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border p-2 font-semibold">Factura #:</td>
                <td className="border p-2">{factura.id}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Empleado:</td>
                <td className="border p-2">{factura.empleadoNombre}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Fecha de Creación:</td>
                <td className="border p-2">{new Date(factura.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Total:</td>
                <td className="border p-2">${formatNumber(factura.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Trabajos</h3>
          {factura.trabajos.length > 0 ? (
            <table className="w-full border-collapse">
              <tbody>
                {factura.trabajos.map((trabajo) => (
                  <tr key={trabajo.id}>
                    <td className="border p-2">{trabajo.titulo}</td>
                    <td className="border p-2 text-right">${formatNumber(trabajo.precio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Ningún trabajo disponible</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Vales</h3>
          {factura.vales.length > 0 ? (
            <table className="w-full border-collapse">
              <tbody>
                {factura.vales.map((vale) => (
                  <tr key={vale.id}>
                    <td className="border p-2">{vale.descripcion}</td>
                    <td className="border p-2 text-right">${formatNumber(vale.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Ningún vale disponible</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Consumos</h3>
          {factura.consumos.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Producto</th>
                  <th className="border p-2 text-right">Cantidad</th>
                  <th className="border p-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {factura.consumos.map((consumo) => (
                  <tr key={consumo.id}>
                    <td className="border p-2">{consumo.nombreProducto}</td>
                    <td className="border p-2 text-right">{formatNumber(consumo.cantidad)}</td>
                    <td className="border p-2 text-right">${formatNumber(consumo.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Ningún consumo disponible</p>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500"
            onClick={handleBack}
          >
            Volver
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-500"
            onClick={handleDownloadPDF}
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
