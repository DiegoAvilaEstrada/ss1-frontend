import jsPDF from "jspdf";

interface FacturaData {
  id: number;
  fechaEmision?: string;
  montoTotal?: number;
  total?: number;
  estado?: string;
  paciente?: {
    nombre?: string;
    apellido?: string;
    dpi?: string;
    email?: string;
    telefono?: string;
    nit?: string;
  };
  tratamiento?: {
    id?: number;
    diagnostico?: string;
    fechaInicio?: string;
    fechaFin?: string;
    estadoTratamiento?: string;
    psicologo?: {
      nombre?: string;
      apellido?: string;
      dpi?: string;
    };
  };
  detalleFactura?: Array<{
    id?: number;
    cantidad?: number;
    precioUnitario?: number;
    costoTotal?: number;
    subtotal?: number;
    producto?: {
      nombreProducto?: string;
      descripcion?: string;
      precioVenta?: number;
    };
  }>;
}

export const generarPDFFactura = (factura: FacturaData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Configuración de colores
  const primaryColor = [33, 150, 243]; // Azul primario
  const textColor = [33, 33, 33]; // Texto oscuro
  const lightGray = [245, 245, 245]; // Fondo gris claro

  // Función para agregar nueva página si es necesario
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Encabezado con fondo de color
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PSIFIRM", margin, 25);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema de Gestión Psicológica", margin, 35);
  doc.text("Factura", margin, 45);

  yPosition = 65;

  // Información de la factura
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Factura #${factura.id}`, pageWidth - margin, yPosition, { align: "right" });
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  if (factura.fechaEmision) {
    const fecha = new Date(factura.fechaEmision).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Fecha de Emisión: ${fecha}`, pageWidth - margin, yPosition, { align: "right" });
    yPosition += 7;
  }
  
  if (factura.estado) {
    doc.text(`Estado: ${factura.estado}`, pageWidth - margin, yPosition, { align: "right" });
    yPosition += 15;
  } else {
    yPosition += 10;
  }

  // Información del Paciente
  if (factura.paciente) {
    checkPageBreak(50);
    doc.setFillColor(...lightGray);
    
    // Calcular altura dinámica según la cantidad de información
    const pacienteInfo = [];
    if (factura.paciente.nombre || factura.paciente.apellido) {
      pacienteInfo.push(`Nombre: ${factura.paciente.nombre || ""} ${factura.paciente.apellido || ""}`.trim());
    }
    if (factura.paciente.dpi) {
      pacienteInfo.push(`DPI: ${factura.paciente.dpi}`);
    }
    if (factura.paciente.email) {
      pacienteInfo.push(`Email: ${factura.paciente.email}`);
    }
    if (factura.paciente.telefono) {
      pacienteInfo.push(`Teléfono: ${factura.paciente.telefono}`);
    }
    if (factura.paciente.nit) {
      pacienteInfo.push(`NIT: ${factura.paciente.nit}`);
    }
    
    const altura = 20 + (pacienteInfo.length * 6);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, altura, 3, 3, "F");
    
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Paciente", margin + 5, yPosition + 10);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    if (pacienteInfo.length > 0) {
      pacienteInfo.forEach((info) => {
        doc.text(info, margin + 5, yPosition);
        yPosition += 6;
      });
    } else {
      doc.text("Información no disponible", margin + 5, yPosition);
      yPosition += 6;
    }
    
    yPosition += 10;
  } else {
    // Si no hay datos del paciente, mostrar un mensaje indicando que no hay información
    checkPageBreak(30);
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, "F");
    
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Paciente", margin + 5, yPosition + 10);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Información no disponible", margin + 5, yPosition);
    
    yPosition += 15;
  }

  // Información del Tratamiento
  if (factura.tratamiento) {
    checkPageBreak(50);
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, "F");
    
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Tratamiento", margin + 5, yPosition + 10);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    if (factura.tratamiento.id) {
      doc.text(`ID Tratamiento: ${factura.tratamiento.id}`, margin + 5, yPosition);
      yPosition += 6;
    }
    if (factura.tratamiento.diagnostico) {
      const diagnosticoLines = doc.splitTextToSize(`Diagnóstico: ${factura.tratamiento.diagnostico}`, pageWidth - 2 * margin - 10);
      doc.text(diagnosticoLines, margin + 5, yPosition);
      yPosition += diagnosticoLines.length * 6;
    }
    if (factura.tratamiento.fechaInicio) {
      const fechaInicio = new Date(factura.tratamiento.fechaInicio).toLocaleDateString("es-GT");
      doc.text(`Fecha de Inicio: ${fechaInicio}`, margin + 5, yPosition);
      yPosition += 6;
    }
    if (factura.tratamiento.psicologo) {
      const psicologoNombre = `${factura.tratamiento.psicologo.nombre || ""} ${factura.tratamiento.psicologo.apellido || ""}`.trim();
      if (psicologoNombre) {
        doc.text(`Psicólogo: ${psicologoNombre}`, margin + 5, yPosition);
        yPosition += 6;
      }
    }
    
    yPosition += 10;
  }

  // Detalle de productos/servicios
  if (factura.detalleFactura && factura.detalleFactura.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de Productos/Servicios", margin, yPosition);
    yPosition += 10;

    // Encabezado de tabla
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 10, 3, 3, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Producto/Servicio", margin + 5, yPosition + 7);
    doc.text("Cantidad", margin + 90, yPosition + 7);
    doc.text("Precio Unit.", margin + 125, yPosition + 7);
    doc.text("Subtotal", pageWidth - margin - 5, yPosition + 7, { align: "right" });
    
    yPosition += 12;
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");

    factura.detalleFactura.forEach((detalle, index) => {
      checkPageBreak(25);
      
      if (index > 0 && index % 2 === 0) {
        doc.setFillColor(...lightGray);
        doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 12, "F");
      }
      
      const productoNombre = detalle.producto?.nombreProducto || "Producto";
      const cantidad = detalle.cantidad || 1;
      const precioUnitario = detalle.precioUnitario || detalle.producto?.precioVenta || 0;
      const subtotal = detalle.subtotal || detalle.costoTotal || (precioUnitario * cantidad);

      const productoLines = doc.splitTextToSize(productoNombre, 75);
      doc.text(productoLines, margin + 5, yPosition + 5);
      doc.text(cantidad.toString(), margin + 95, yPosition + 5);
      doc.text(`Q ${precioUnitario.toFixed(2)}`, margin + 128, yPosition + 5);
      doc.text(`Q ${subtotal.toFixed(2)}`, pageWidth - margin - 5, yPosition + 5, { align: "right" });
      
      yPosition += Math.max(12, productoLines.length * 6);
    });

    yPosition += 5;
    
    // Total
    checkPageBreak(20);
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin + 100, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    const total = factura.total || factura.montoTotal || 0;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: Q ${total.toFixed(2)}`, pageWidth - margin, yPosition, { align: "right" });
  } else {
    // Si no hay detalles, mostrar el total directamente
    checkPageBreak(15);
    const total = factura.total || factura.montoTotal || 0;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: Q ${total.toFixed(2)}`, pageWidth - margin, yPosition, { align: "right" });
  }

  // Pie de página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "Gracias por su preferencia",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Descargar el PDF
  doc.save(`factura_${factura.id}.pdf`);
};

