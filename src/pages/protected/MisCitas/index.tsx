import { useAlert } from "@components/Alerts";
import { Search, Visibility } from "@mui/icons-material";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import { getAllSesiones } from "@services/sesion.service";
import { getAllCuentasPacientes } from "@services/cuentaPaciente.service";
import { useEffect, useState } from "react";
import { getPacienteDpi, getUserInfo } from "@utilities/Functions";
import ModalViewDetallesSesion from "../Citas/Components/ModalViewDetallesSesion";

const MisCitas = () => {
  const { AlertError } = useAlert();
  const [rows, setRows] = useState<any[]>([]);
  const [allRows, setAllRows] = useState<any[]>([]); // Todas las sesiones
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [modalViewDetallesOpen, setModalViewDetallesOpen] = useState(false);
  const [sesionIdDetalles, setSesionIdDetalles] = useState<number | null>(null);

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
      console.log("=== OBTENIENDO CITAS ===");
      console.log("DPI del paciente:", dpiString);

      // Consumir el endpoint /sesion_psicologica/all
      const response = await getAllSesiones();
      console.log("Respuesta completa de sesiones:", response);

      // Verificar si hay un error en la respuesta
      if (response?.code && response.code !== 200) {
        const errorMessage = response?.message || "Error al obtener las citas";
        console.error("Error en respuesta del servidor:", errorMessage);
        AlertError(errorMessage);
        setAllRows([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      let sesiones: any[] = [];
      if (response?.responseObject && Array.isArray(response.responseObject)) {
        sesiones = response.responseObject;
      } else if (Array.isArray(response)) {
        sesiones = response;
      }

      // Filtrar sesiones por el DPI del paciente logueado
      const sesionesPaciente = sesiones.filter((sesion: any) => {
        const dpiSesion = 
          sesion.tratamiento?.paciente?.dpi ||
          sesion.paciente?.dpi;
        return String(dpiSesion) === dpiString;
      });

      console.log("Sesiones obtenidas para el paciente:", sesionesPaciente.length);
      setAllRows(sesionesPaciente);
      setTotal(sesionesPaciente.length);
    } catch (error: any) {
      console.error("Error completo cargando citas:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      
      // Extraer el mensaje de error del backend
      const errorMessage = 
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error al cargar tus citas";
      
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
    const filtered = allRows.filter((sesion: any) => {
      const searchTerm = filter.toLowerCase();
      return (
        sesion.id?.toString().includes(searchTerm) ||
        sesion.fechaSesion?.toLowerCase().includes(searchTerm) ||
        sesion.observaciones?.toLowerCase().includes(searchTerm) ||
        sesion.tratamiento?.diagnostico?.toLowerCase().includes(searchTerm) ||
        sesion.tratamiento?.psicologo?.nombre?.toLowerCase().includes(searchTerm) ||
        sesion.tratamiento?.psicologo?.apellido?.toLowerCase().includes(searchTerm)
      );
    });
    setTotal(filtered.length);
    setRows(filtered.slice(page * pageSize, page * pageSize + pageSize));
  }, [page, pageSize, filter, allRows]);

  const handleVerDetalle = (sesionId: number) => {
    setSesionIdDetalles(sesionId);
    setModalViewDetallesOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={"bold"} gutterBottom>
        Mis Citas
      </Typography>
      <Divider sx={{ mt: 1, mb: 3 }} />
      <TextField 
        label="Buscar por ID, fecha, observaciones, diagnóstico o psicólogo" 
        variant="outlined" 
        fullWidth 
        sx={{ mb: 2 }} 
        value={filter} 
        onChange={(e) => {
          setPage(0);
          setFilter(e.target.value);
        }}
        slotProps={{ input: { endAdornment: <InputAdornment position="end"><Search /></InputAdornment> } }} 
      />
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID Sesión</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Psicólogo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha de Sesión</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Observaciones</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado Tratamiento</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={28} /></TableCell></TableRow> :
                rows.length > 0 ? rows.map((row, index) => (
                  <TableRow key={row.id || index}>
                    <TableCell>{row.id || "-"}</TableCell>
                    <TableCell>
                      {row.tratamiento?.psicologo
                        ? `${row.tratamiento.psicologo.nombre || ""} ${row.tratamiento.psicologo.apellido || ""}`.trim() || "-"
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {row.fechaSesion
                        ? new Date(row.fechaSesion).toLocaleDateString("es-GT", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={row.observaciones || "-"}
                      >
                        {row.observaciones || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.tratamiento?.estadoTratamiento || row.estadoTratamiento || "Sin estado"}
                        size="small"
                        color={
                          (row.tratamiento?.estadoTratamiento || row.estadoTratamiento || "").toUpperCase() === "EN PROCESO"
                            ? "info"
                            : (row.tratamiento?.estadoTratamiento || row.estadoTratamiento || "").toUpperCase() === "FINALIZADO"
                            ? "success"
                            : (row.tratamiento?.estadoTratamiento || row.estadoTratamiento || "").toUpperCase() === "CANCELADO"
                            ? "error"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver Detalles">
                        <IconButton
                          color="info"
                          onClick={() => handleVerDetalle(row.id)}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={6} align="center"><Typography sx={{ opacity: 0.7 }}>No tienes citas registradas.</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={total} page={page} onPageChange={(e, newPage) => { e; setPage(newPage); }} rowsPerPageOptions={[5, 10, 25, 50]} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Cantidad por página" />
      </Paper>

      <ModalViewDetallesSesion
        open={modalViewDetallesOpen}
        onClose={() => {
          setModalViewDetallesOpen(false);
          setSesionIdDetalles(null);
        }}
        sesionId={sesionIdDetalles}
      />
    </Box>
  );
};

export default MisCitas;
