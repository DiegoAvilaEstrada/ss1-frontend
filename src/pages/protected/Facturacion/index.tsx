import { useAlert } from "@components/Alerts";
import { Add, Search, Receipt, Payment, GetApp, ShoppingCart, LocalHospital } from "@mui/icons-material";
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
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getAllFacturas, getFacturasByDpi, generarPDF } from "@services/facturacion.service";
import { useEffect, useState } from "react";
import { getUserInfo, getRole, getPacienteDpi } from "@utilities/Functions";
import ModalCreateFactura from "./Components/ModalCreateFactura";
import ModalPago from "./Components/ModalPago";
import ModalPagoProductos from "./Components/ModalPagoProductos";
import ModalPagoCitaClinica from "./Components/ModalPagoCitaClinica";
import ModalDetalleFactura from "./Components/ModalDetalleFactura";

const Facturacion = () => {
  const { AlertError, AlertSuccess } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [modalPagoProductosOpen, setModalPagoProductosOpen] = useState(false);
  const [modalPagoCitaClinicaOpen, setModalPagoCitaClinicaOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [facturaData, setFacturaData] = useState<any>(null);
  const [facturaIdDetalle, setFacturaIdDetalle] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);

  const [allRows, setAllRows] = useState<any[]>([]); // Almacena todas las facturas

  const fetchData = async () => {
    setLoading(true);
    try {
      const userInfo = getUserInfo();
      const userRole = getRole();
      
      // Si el usuario es un paciente (CLIENTE), obtener facturas por DPI
      if (userRole === "CLIENTE" || userInfo?.role === "CLIENTE") {
        // Obtener el DPI del paciente
        const pacienteDpi = getPacienteDpi() || userInfo?.dpi;
        
        if (!pacienteDpi) {
          AlertError("No se pudo obtener el DPI del paciente");
          setAllRows([]);
          setTotal(0);
          setLoading(false);
          return;
        }
        
        console.log("Obteniendo facturas para el paciente con DPI:", pacienteDpi);
        const response = await getFacturasByDpi(pacienteDpi);
        console.log("Respuesta de facturas por DPI:", response);
        
        if (response?.responseObject && Array.isArray(response.responseObject)) {
          setAllRows(response.responseObject);
          setTotal(response.responseObject.length);
        } else if (Array.isArray(response)) {
          setAllRows(response);
          setTotal(response.length);
        } else {
          setAllRows([]);
          setTotal(0);
        }
      } else {
        // Si es empleado, obtener todas las facturas
        const response = await getAllFacturas();
        console.log("Respuesta de facturas:", response);
        if (response?.responseObject && Array.isArray(response.responseObject)) {
          setAllRows(response.responseObject);
          setTotal(response.responseObject.length);
        } else if (Array.isArray(response)) {
          setAllRows(response);
          setTotal(response.length);
        } else {
          setAllRows([]);
          setTotal(0);
        }
      }
    } catch (error) {
      console.error("Error fetching facturas:", error);
      AlertError("Error al cargar las facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // Filtrado y paginación del lado del cliente
  useEffect(() => {
    const filtered = allRows.filter(
      (factura) =>
        factura.paciente?.nombre?.toLowerCase().includes(filter.toLowerCase()) ||
        factura.paciente?.apellido?.toLowerCase().includes(filter.toLowerCase()) ||
        factura.paciente?.email?.toLowerCase().includes(filter.toLowerCase()) ||
        factura.id?.toString().includes(filter) ||
        factura.tratamiento?.diagnostico?.toLowerCase().includes(filter.toLowerCase()) ||
        factura.estado?.toLowerCase().includes(filter.toLowerCase()) ||
        factura.total?.toString().includes(filter) ||
        factura.montoTotal?.toString().includes(filter)
    );
    setTotal(filtered.length);
    setRows(filtered.slice(page * pageSize, page * pageSize + pageSize));
  }, [page, pageSize, filter, allRows]);

  const handleVerDetalle = (facturaId: number) => {
    setFacturaIdDetalle(facturaId);
    setModalDetalleOpen(true);
  };

  const handlePago = (row: any) => {
    setFacturaData(row);
    setModalPagoOpen(true);
  };

  const handleGenerarPDF = async (facturaId: number) => {
    try {
      await generarPDF(facturaId);
      AlertSuccess("PDF descargado exitosamente");
    } catch (error: any) {
      console.error("Error descargando PDF:", error);
      AlertError(
        String(
          error?.response?.data?.message ||
            error?.message ||
            "Error al descargar el PDF. Por favor intenta nuevamente."
        )
      );
    }
  };

  const getEstadoColor = (estado: string) => {
    const estadoUpper = estado?.toUpperCase() || "";
    if (estadoUpper.includes("PAGADA") || estadoUpper.includes("PAGADO")) {
      return "success";
    }
    if (estadoUpper.includes("PENDIENTE")) {
      return "warning";
    }
    if (estadoUpper.includes("ANULADA") || estadoUpper.includes("ANULADO")) {
      return "error";
    }
    return "default";
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h4" fontWeight={"bold"}>
            {getRole() === "CLIENTE" || getUserInfo()?.role === "CLIENTE" ? "Mis Facturas" : "Gestión de Facturación"}
          </Typography>
          {(getRole() !== "CLIENTE" && getUserInfo()?.role !== "CLIENTE") && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => setModalCreateOpen(true)}>
                <Add /> Crear Factura
              </Button>
              <Button variant="contained" color="info" sx={{ textTransform: "none" }} onClick={() => setModalPagoProductosOpen(true)}>
                <ShoppingCart /> Pago Productos
              </Button>
              <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => setModalPagoCitaClinicaOpen(true)}>
                <LocalHospital /> Pagar Cita Clínica
              </Button>
            </Box>
          )}
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField
          label="Buscar por paciente, diagnóstico, estado, total o ID"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={filter}
          onChange={(e) => {
            setPage(0);
            setFilter(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Paciente</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha Emisión</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tratamiento</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={row.id || index}>
                      <TableCell>{row.id || "-"}</TableCell>
                      <TableCell>
                        {row.paciente
                          ? `${row.paciente.nombre || ""} ${row.paciente.apellido || ""}`.trim() || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.fechaEmision
                          ? new Date(row.fechaEmision).toLocaleDateString("es-GT")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.tratamiento?.diagnostico
                          ? row.tratamiento.diagnostico
                          : row.tratamiento?.id
                          ? `Tratamiento #${row.tratamiento.id}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">
                          Q {row.total?.toFixed(2) || row.montoTotal?.toFixed(2) || "0.00"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.estado || "Pendiente"}
                          color={getEstadoColor(row.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Ver Detalles">
                            <IconButton
                              color="info"
                              onClick={() => handleVerDetalle(row.id)}
                              size="small"
                            >
                              <Receipt />
                            </IconButton>
                          </Tooltip>
                          {(getRole() !== "CLIENTE" && getUserInfo()?.role !== "CLIENTE") && 
                            row.estado &&
                            !row.estado.toUpperCase().includes("PAGADA") &&
                            !row.estado.toUpperCase().includes("PAGADO") && (
                              <Tooltip title="Registrar Pago">
                                <IconButton
                                  color="success"
                                  onClick={() => handlePago(row)}
                                  size="small"
                                >
                                  <Payment />
                                </IconButton>
                              </Tooltip>
                            )}
                          <Tooltip title="Descargar PDF">
                            <IconButton
                              color="primary"
                              onClick={() => handleGenerarPDF(row.id)}
                              size="small"
                            >
                              <GetApp />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography sx={{ opacity: 0.7 }}>No hay facturas registradas.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={total} page={page} onPageChange={(e, newPage) => { e; setPage(newPage); }} rowsPerPageOptions={[5, 10, 25, 50]} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Cantidad por página" />
        </Paper>
      </Box>

      <ModalCreateFactura
        open={modalCreateOpen}
        onClose={() => setModalCreateOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ModalPago
        open={modalPagoOpen}
        onClose={() => setModalPagoOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
        facturaData={facturaData}
      />
      <ModalPagoProductos
        open={modalPagoProductosOpen}
        onClose={() => setModalPagoProductosOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
        facturaData={facturaData}
      />
      <ModalPagoCitaClinica
        open={modalPagoCitaClinicaOpen}
        onClose={() => setModalPagoCitaClinicaOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ModalDetalleFactura
        open={modalDetalleOpen}
        onClose={() => {
          setModalDetalleOpen(false);
          setFacturaIdDetalle(null);
        }}
        facturaId={facturaIdDetalle}
      />
    </>
  );
};

export default Facturacion;
