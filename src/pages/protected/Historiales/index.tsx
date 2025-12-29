import { useAlert } from "@components/Alerts";
import { Add, Edit, Search, Visibility, Psychology } from "@mui/icons-material";
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
  IconButton,
  Tooltip,
  Divider,
  InputAdornment,
  Button,
  Chip,
} from "@mui/material";
import { getAllTratamientos } from "@services/tratamiento.service";
import { getAllSesiones } from "@services/sesion.service";
import { useEffect, useState } from "react";
import ModalCreateTratamiento from "./Components/ModalCreateTratamiento";
import ModalCreateSesion from "./Components/ModalCreateSesion";
import ModalUpdateEstadoTratamiento from "./Components/ModalUpdateEstadoTratamiento";
import ModalViewDetallesTratamiento from "./Components/ModalViewDetallesTratamiento";

const Historiales = () => {
  const { AlertError } = useAlert();
  const [modalCreateTratamientoOpen, setModalCreateTratamientoOpen] = useState(false);
  const [modalCreateSesionOpen, setModalCreateSesionOpen] = useState(false);
  const [modalUpdateEstadoOpen, setModalUpdateEstadoOpen] = useState(false);
  const [modalViewDetallesOpen, setModalViewDetallesOpen] = useState(false);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [sesionesCount, setSesionesCount] = useState<Record<number, number>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllTratamientos();
      console.log("Respuesta de tratamientos:", res);

      // El backend devuelve: { code: 200, message: "...", responseObject: [...] }
      let tratamientos: any[] = [];
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        tratamientos = res.responseObject;
      } else if (Array.isArray(res)) {
        tratamientos = res;
      } else if (res?.code === 200 && res?.responseObject && Array.isArray(res.responseObject)) {
        tratamientos = res.responseObject;
      }

      // Aplicar filtro si existe
      if (filter) {
        const filterLower = filter.toLowerCase();
        tratamientos = tratamientos.filter((t: any) => 
          (t.paciente?.nombre || "").toLowerCase().includes(filterLower) ||
          (t.paciente?.apellido || "").toLowerCase().includes(filterLower) ||
          (t.psicologo?.nombre || "").toLowerCase().includes(filterLower) ||
          (t.psicologo?.apellido || "").toLowerCase().includes(filterLower) ||
          (t.estadoTratamiento || t.estado || "").toLowerCase().includes(filterLower) ||
          (t.psicologo?.dpi || t.psicologoDpi || t.psicologo_dpi || "").toString().includes(filterLower) ||
          (t.paciente?.dpi || t.dpiPaciente || "").toString().includes(filterLower)
        );
      }

      setTotal(tratamientos.length);

      // Aplicar paginación
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      setRows(tratamientos.slice(startIndex, endIndex));

      // Cargar conteo de sesiones para cada tratamiento
      await loadSesionesCount(tratamientos);
      
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching tratamientos:", error);
      setLoading(false);
      AlertError("Error al cargar los tratamientos");
      setRows([]);
      setTotal(0);
    }
  };

  const loadSesionesCount = async (tratamientos: any[]) => {
    try {
      const resSesiones = await getAllSesiones();
      const sesiones = resSesiones?.responseObject || resSesiones || [];
      const countMap: Record<number, number> = {};

      tratamientos.forEach((tratamiento: any) => {
        const idTratamiento = tratamiento.id;
        const count = Array.isArray(sesiones)
          ? sesiones.filter((s: any) => {
              const idTrat = s.idTratamiento || s.tratamiento?.id || s.tratamiento?.idTratamiento;
              return String(idTrat) === String(idTratamiento);
            }).length
          : 0;
        countMap[idTratamiento] = count;
      });

      setSesionesCount(countMap);
    } catch (error) {
      console.error("Error cargando conteo de sesiones:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  const handleViewDetails = (row: any) => {
    setTratamientoSeleccionado(row);
    setModalViewDetallesOpen(true);
  };

  const handleCreateSesion = (tratamiento: any) => {
    setTratamientoSeleccionado(tratamiento);
    setModalCreateSesionOpen(true);
  };

  const handleUpdateEstado = (tratamiento: any) => {
    setTratamientoSeleccionado(tratamiento);
    setModalUpdateEstadoOpen(true);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={"bold"}>
            Historiales Clínicos (Tratamientos)
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
            onClick={() => setModalCreateTratamientoOpen(true)}
          >
            <Add /> Crear Tratamiento
          </Button>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField
          label="Buscar por paciente, psicólogo, estado o DPI"
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
                  <TableCell sx={{ fontWeight: "bold" }}>Psicólogo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha Inicio</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Medicado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sesiones</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.id || "-"}</TableCell>
                      <TableCell>
                        {row.paciente
                          ? `${row.paciente.nombre || ""} ${row.paciente.apellido || ""}`.trim() || row.paciente.dpi || "-"
                          : row.dpiPaciente || "-"}
                      </TableCell>
                      <TableCell>
                        {row.psicologo
                          ? `${row.psicologo.nombre || ""} ${row.psicologo.apellido || ""}`.trim() || row.psicologo.dpi || "-"
                          : row.psicologoDpi || row.psicologo_dpi || "-"}
                      </TableCell>
                      <TableCell>
                        {row.fechaInicio
                          ? new Date(row.fechaInicio).toLocaleDateString("es-GT")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.estadoTratamiento || row.estado || "Sin estado"}
                          size="small"
                          color={
                            (row.estadoTratamiento || row.estado || "").toUpperCase() === "EN PROCESO"
                              ? "info"
                              : (row.estadoTratamiento || row.estado || "").toUpperCase() === "FINALIZADO"
                              ? "success"
                              : (row.estadoTratamiento || row.estado || "").toUpperCase() === "CANCELADO"
                              ? "error"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.medicado ? "Sí" : "No"}
                          size="small"
                          color={row.medicado ? "info" : "default"}
                        />
                      </TableCell>
                      <TableCell>{sesionesCount[row.id] || 0}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Ver Detalles">
                            <IconButton
                              color="info"
                              onClick={() => handleViewDetails(row)}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Agregar Sesión">
                            <IconButton
                              color="success"
                              onClick={() => handleCreateSesion(row)}
                              size="small"
                            >
                              <Psychology />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Actualizar Estado">
                            <IconButton
                              color="warning"
                              onClick={() => handleUpdateEstado(row)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography sx={{ opacity: 0.7 }}>
                        No hay tratamientos registrados.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => {
              e;
              setPage(newPage);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Cantidad por página"
          />
        </Paper>
      </Box>

      <ModalCreateTratamiento
        open={modalCreateTratamientoOpen}
        onClose={() => setModalCreateTratamientoOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ModalCreateSesion
        open={modalCreateSesionOpen}
        onClose={() => {
          setModalCreateSesionOpen(false);
          setTratamientoSeleccionado(null);
        }}
        refresh={refresh}
        setRefresh={setRefresh}
        tratamientoId={tratamientoSeleccionado?.id || null}
      />
      <ModalUpdateEstadoTratamiento
        open={modalUpdateEstadoOpen}
        onClose={() => {
          setModalUpdateEstadoOpen(false);
          setTratamientoSeleccionado(null);
        }}
        refresh={refresh}
        setRefresh={setRefresh}
        tratamientoData={tratamientoSeleccionado}
      />
      <ModalViewDetallesTratamiento
        open={modalViewDetallesOpen}
        onClose={() => {
          setModalViewDetallesOpen(false);
          setTratamientoSeleccionado(null);
        }}
        tratamientoId={tratamientoSeleccionado?.id || null}
      />
    </>
  );
};

export default Historiales;
