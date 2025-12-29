import { useAlert } from "@components/Alerts";
import { Add, Search, Visibility, GetApp } from "@mui/icons-material";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  CircularProgress,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Chip,
} from "@mui/material";
import { getAllDetalleFactura, getDetalleFacturaByFacturaId } from "@services/detalleFactura.service";
import { getFacturaById } from "@services/facturacion.service";
import { generarPDFFactura } from "@utilities/pdfGenerator";
import { useEffect, useState } from "react";
import ModalViewDetallesVenta from "./Components/ModalViewDetallesVenta";
import ModalCreateVenta from "./Components/ModalCreateVenta";

const Ventas = () => {
  const { AlertError, AlertSuccess } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalViewDetallesOpen, setModalViewDetallesOpen] = useState(false);
  const [detalleIdDetalles, setDetalleIdDetalles] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllDetalleFactura();
      console.log("Respuesta de detalles de factura:", res);

      // El backend devuelve: { code: 200, message: "...", responseObject: [...] }
      let detalles: any[] = [];
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        detalles = res.responseObject;
      } else if (Array.isArray(res)) {
        detalles = res;
      }

      // Aplicar filtro si existe
      if (filter) {
        const filterLower = filter.toLowerCase();
        detalles = detalles.filter((d: any) => 
          (d.factura?.paciente?.nombre || "").toLowerCase().includes(filterLower) ||
          (d.factura?.paciente?.apellido || "").toLowerCase().includes(filterLower) ||
          (d.producto?.nombreProducto || "").toLowerCase().includes(filterLower) ||
          (d.factura?.id?.toString() || "").includes(filterLower) ||
          (d.producto?.tipoProducto?.nombreTipo || "").toLowerCase().includes(filterLower) ||
          (d.factura?.tratamiento?.psicologo?.nombre || "").toLowerCase().includes(filterLower) ||
          (d.factura?.tratamiento?.psicologo?.apellido || "").toLowerCase().includes(filterLower) ||
          (d.factura?.tratamiento?.estadoTratamiento || "").toLowerCase().includes(filterLower)
        );
      }

      setTotal(detalles.length);

      // Aplicar paginación
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      setRows(detalles.slice(startIndex, endIndex));
      
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching detalles de factura:", error);
      setLoading(false);
      AlertError("Error al cargar las ventas");
      setRows([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  const handleViewDetails = (id: number) => {
    setDetalleIdDetalles(id);
    setModalViewDetallesOpen(true);
  };

  const handleGenerarPDF = async (facturaId: number, rowData?: any) => {
    try {
      // Construir la factura desde los datos de la fila
      let facturaData: any = {
        id: facturaId,
      };

      // Si tenemos datos de la fila, construir la factura desde ahí
      if (rowData?.factura) {
        facturaData = {
          id: rowData.factura.id || facturaId,
          fechaEmision: rowData.factura.fechaEmision,
          montoTotal: rowData.factura.montoTotal,
          total: rowData.factura.montoTotal || rowData.factura.total,
          estado: rowData.factura.estado,
          paciente: rowData.factura.paciente,
          tratamiento: rowData.factura.tratamiento,
        };
      } else {
        // Si no tenemos datos de la fila, intentar obtenerlos del API
        try {
          const res = await getFacturaById(facturaId);
          const apiFactura = res?.responseObject || res;
          if (apiFactura && apiFactura.id) {
            facturaData = apiFactura;
          }
        } catch (apiError) {
          console.warn("Error obteniendo factura del API, usando datos básicos:", apiError);
        }
      }

      console.log("Datos de factura para PDF:", facturaData);

      // Verificar que tengamos al menos un ID
      if (!facturaData.id) {
        AlertError("No se pudo obtener el ID de la factura");
        return;
      }

      // Intentar obtener los detalles de la factura
      try {
        const detalles = await getDetalleFacturaByFacturaId(facturaId);
        const detallesArray = Array.isArray(detalles) ? detalles : [];
        
        if (detallesArray.length > 0) {
          // Mapear los detalles al formato esperado
          facturaData.detalleFactura = detallesArray.map((detalle: any) => ({
            id: detalle.id,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.producto?.precioVenta || detalle.precioUnitario,
            costoTotal: detalle.costoTotal,
            subtotal: detalle.costoTotal || (detalle.cantidad * (detalle.producto?.precioVenta || 0)),
            producto: detalle.producto ? {
              nombreProducto: detalle.producto.nombreProducto,
              descripcion: detalle.producto.descripcion,
              precioVenta: detalle.producto.precioVenta,
            } : undefined,
          }));
        } else if (rowData) {
          // Si no hay detalles en el API pero tenemos datos de la fila, crear un detalle desde ahí
          facturaData.detalleFactura = [{
            id: rowData.id,
            cantidad: rowData.cantidad,
            precioUnitario: rowData.producto?.precioVenta,
            costoTotal: rowData.costoTotal,
            subtotal: rowData.costoTotal,
            producto: rowData.producto ? {
              nombreProducto: rowData.producto.nombreProducto,
              descripcion: rowData.producto.descripcion,
              precioVenta: rowData.producto.precioVenta,
            } : undefined,
          }];
        }
      } catch (detalleError) {
        console.warn("No se pudieron obtener los detalles de la factura:", detalleError);
        // Si tenemos datos de la fila, crear un detalle desde ahí
        if (rowData) {
          facturaData.detalleFactura = [{
            id: rowData.id,
            cantidad: rowData.cantidad,
            precioUnitario: rowData.producto?.precioVenta,
            costoTotal: rowData.costoTotal,
            subtotal: rowData.costoTotal,
            producto: rowData.producto ? {
              nombreProducto: rowData.producto.nombreProducto,
              descripcion: rowData.producto.descripcion,
              precioVenta: rowData.producto.precioVenta,
            } : undefined,
          }];
        }
      }

      // Generar el PDF con los datos
      generarPDFFactura(facturaData);
      AlertSuccess("PDF generado y descargado exitosamente");
    } catch (error: any) {
      console.error("Error generando PDF:", error);
      console.error("Error completo:", error?.response);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Error al generar el PDF. Por favor intenta nuevamente.";
      
      AlertError(errorMessage);
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={"bold"}>Gestión de Ventas</Typography>
          <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => setModalCreateOpen(true)}>
            <Add /> Nueva Venta
          </Button>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField 
          label="Buscar por factura, paciente, producto, tipo, psicólogo o estado" 
          variant="outlined" 
          fullWidth 
          sx={{ mb: 2 }} 
          value={filter} 
          onChange={(e) => { setPage(0); setFilter(e.target.value); }}
          InputProps={{ endAdornment: <InputAdornment position="end"><Search /></InputAdornment> }} 
        />
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Paciente</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tipo Producto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cantidad</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Precio Unitario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Costo Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Psicólogo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado Tratamiento</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha Emisión</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={10} align="center"><CircularProgress size={28} /></TableCell></TableRow> :
                  rows.length > 0 ? rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {row.factura?.paciente
                          ? `${row.factura.paciente.nombre || ""} ${row.factura.paciente.apellido || ""}`.trim() || row.factura.paciente.dpi || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={row.producto?.nombreProducto || "-"}
                        >
                          {row.producto?.nombreProducto || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.producto?.tipoProducto?.nombreTipo || "-"}
                      </TableCell>
                      <TableCell>{row.cantidad || "-"}</TableCell>
                      <TableCell>Q {row.producto?.precioVenta?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>
                        <Typography fontWeight="medium" color="success.main">
                          Q {row.costoTotal?.toFixed(2) || "0.00"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.factura?.tratamiento?.psicologo
                          ? `${row.factura.tratamiento.psicologo.nombre || ""} ${row.factura.tratamiento.psicologo.apellido || ""}`.trim() || row.factura.tratamiento.psicologo.dpi || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.factura?.tratamiento?.estadoTratamiento || "Sin estado"}
                          size="small"
                          color={
                            (row.factura?.tratamiento?.estadoTratamiento || "").toUpperCase() === "EN PROCESO"
                              ? "info"
                              : (row.factura?.tratamiento?.estadoTratamiento || "").toUpperCase() === "FINALIZADO"
                              ? "success"
                              : (row.factura?.tratamiento?.estadoTratamiento || "").toUpperCase() === "CANCELADO"
                              ? "error"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {row.factura?.fechaEmision
                          ? new Date(row.factura.fechaEmision).toLocaleDateString("es-GT")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Ver Detalles">
                            <IconButton 
                              color="info" 
                              onClick={() => handleViewDetails(row.id)} 
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {row.factura?.id && (
                            <Tooltip title="Descargar PDF de Factura">
                              <IconButton
                                color="primary"
                                onClick={() => handleGenerarPDF(row.factura.id, row)}
                                size="small"
                              >
                                <GetApp />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={10} align="center"><Typography sx={{ opacity: 0.7 }}>No hay ventas registradas.</Typography></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination 
            component="div" 
            count={total} 
            page={page} 
            onPageChange={(e, newPage) => { e; setPage(newPage); }} 
            rowsPerPageOptions={[5, 10, 25, 50]} 
            rowsPerPage={pageSize} 
            onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} 
            labelRowsPerPage="Cantidad por página" 
          />
        </Paper>
      </Box>
      <ModalCreateVenta
        open={modalCreateOpen}
        onClose={() => setModalCreateOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ModalViewDetallesVenta
        open={modalViewDetallesOpen}
        onClose={() => {
          setModalViewDetallesOpen(false);
          setDetalleIdDetalles(null);
        }}
        detalleId={detalleIdDetalles}
      />
    </>
  );
};

export default Ventas;
