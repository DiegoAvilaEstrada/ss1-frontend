import { useAlert } from "@components/Alerts";
import { Search } from "@mui/icons-material";
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
  Chip,
} from "@mui/material";
import { getFacturasByDpi } from "@services/facturacion.service";
import { getAllCuentasPacientes } from "@services/cuentaPaciente.service";
import { useEffect, useState } from "react";
import { getPacienteDpi, getUserInfo } from "@utilities/Functions";

const MisFacturas = () => {
  const { AlertError, AlertSuccess } = useAlert();
  const [rows, setRows] = useState<any[]>([]);
  const [allRows, setAllRows] = useState<any[]>([]); // Todas las facturas
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener DPI del paciente logueado
      const userInfo = getUserInfo();
      let dpiPaciente = null;

      // Siempre intentar obtener el DPI desde las cuentas de pacientes primero (más confiable)
      try {
        const cuentasRes = await getAllCuentasPacientes();
        const cuentas = cuentasRes?.responseObject || cuentasRes || [];
        
        if (Array.isArray(cuentas)) {
          let cuentaEncontrada = null;
          
          // Buscar por username
          if (userInfo?.username) {
            cuentaEncontrada = cuentas.find((c: any) => c.username === userInfo.username);
          }
          
          // Si no se encontró, buscar por email
          if (!cuentaEncontrada && userInfo?.email) {
            cuentaEncontrada = cuentas.find((c: any) => 
              c.paciente?.email === userInfo.email || 
              c.username === userInfo.email.split("@")[0]
            );
          }
          
          // Si aún no se encontró, buscar por nombre
          if (!cuentaEncontrada && userInfo?.name) {
            const usernameFromName = userInfo.name.toLowerCase().replace(/\s+/g, ".");
            cuentaEncontrada = cuentas.find((c: any) => c.username === usernameFromName);
          }
          
          if (cuentaEncontrada?.paciente?.dpi) {
            dpiPaciente = cuentaEncontrada.paciente.dpi;
            console.log("DPI obtenido desde cuenta paciente:", dpiPaciente);
          }
        }
      } catch (error) {
        console.error("Error obteniendo DPI desde cuenta paciente:", error);
      }

      // Si no se encontró en las cuentas, intentar desde otras fuentes
      if (!dpiPaciente) {
        dpiPaciente = getPacienteDpi() || userInfo?.dpi;
        console.log("DPI obtenido desde cookies/userInfo:", dpiPaciente);
      }

      if (!dpiPaciente) {
        AlertError("No se pudo obtener el DPI del paciente. Por favor, verifica tu información de perfil.");
        setAllRows([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      // Asegurar que el DPI sea un string y limpiarlo
      const dpiString = String(dpiPaciente).trim();
      console.log("=== OBTENIENDO FACTURAS ===");
      console.log("DPI del paciente:", dpiString);
      console.log("Tipo de DPI:", typeof dpiString);
      console.log("Longitud del DPI:", dpiString.length);

      // Consumir el endpoint /factura/{dpi} directamente
      let response;
      try {
        response = await getFacturasByDpi(dpiString);
        console.log("Respuesta completa de facturas por DPI:", response);
        console.log("Código de respuesta:", response?.code);
        console.log("Mensaje de respuesta:", response?.message);
      } catch (apiError: any) {
        console.error("Error en la llamada API:", apiError);
        console.error("Error response:", apiError?.response);
        console.error("Error response data:", apiError?.response?.data);
        throw apiError; // Re-lanzar para que se maneje en el catch principal
      }

      // Verificar si hay un error en la respuesta
      if (response?.code && response.code !== 200) {
        const errorMessage = response?.message || "Error al obtener las facturas";
        console.error("Error en respuesta del servidor:", errorMessage);
        AlertError(errorMessage);
        setAllRows([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      let facturas: any[] = [];
      if (response?.responseObject && Array.isArray(response.responseObject)) {
        facturas = response.responseObject;
      } else if (Array.isArray(response)) {
        facturas = response;
      }

      console.log("Facturas obtenidas:", facturas.length);
      setAllRows(facturas);
      setTotal(facturas.length);
    } catch (error: any) {
      console.error("Error completo cargando facturas:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      
      // Extraer el mensaje de error del backend
      const errorMessage = 
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error al cargar tus facturas";
      
      AlertError(errorMessage);
      setAllRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // Filtrado y paginación del lado del cliente
  useEffect(() => {
    const filtered = allRows.filter((factura: any) => {
      const searchTerm = filter.toLowerCase();
      return (
        factura.id?.toString().includes(searchTerm) ||
        factura.numero?.toString().includes(searchTerm) ||
        factura.fecha?.toLowerCase().includes(searchTerm) ||
        factura.fechaEmision?.toLowerCase().includes(searchTerm) ||
        factura.estado?.toLowerCase().includes(searchTerm) ||
        factura.total?.toString().includes(searchTerm) ||
        factura.montoTotal?.toString().includes(searchTerm)
      );
    });
    setTotal(filtered.length);
    setRows(filtered.slice(page * pageSize, page * pageSize + pageSize));
  }, [page, pageSize, filter, allRows]);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={"bold"} gutterBottom>
        Mis Facturas
      </Typography>
      <Divider sx={{ mt: 1, mb: 3 }} />
      <TextField label="Buscar" variant="outlined" fullWidth sx={{ mb: 2 }} value={filter} onChange={(e) => { setPage(0); setFilter(e.target.value); }}
        slotProps={{ input: { endAdornment: <InputAdornment position="end"><Search /></InputAdornment> } }} />
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Número</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={28} /></TableCell></TableRow> :
                rows.length > 0 ? rows.map((row, index) => (
                  <TableRow key={row.id || index}>
                    <TableCell>{row.id || row.numero || "-"}</TableCell>
                    <TableCell>
                      {row.fechaEmision 
                        ? new Date(row.fechaEmision).toLocaleDateString("es-GT")
                        : row.fecha 
                        ? new Date(row.fecha).toLocaleDateString("es-GT")
                        : "-"}
                    </TableCell>
                    <TableCell>Q {(row.total || row.montoTotal || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.estado || "PENDIENTE"} 
                        color={
                          row.estado?.toUpperCase().includes("PAGADA") || row.estado?.toUpperCase().includes("PAGADO") 
                            ? "success" 
                            : row.estado?.toUpperCase().includes("PENDIENTE")
                            ? "warning"
                            : row.estado?.toUpperCase().includes("ANULADA") || row.estado?.toUpperCase().includes("ANULADO")
                            ? "error"
                            : "default"
                        } 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={4} align="center"><Typography sx={{ opacity: 0.7 }}>No tienes facturas registradas.</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={total} page={page} onPageChange={(e, newPage) => { e; setPage(newPage); }} rowsPerPageOptions={[5, 10, 25, 50]} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Cantidad por página" />
      </Paper>
    </Box>
  );
};

export default MisFacturas;
