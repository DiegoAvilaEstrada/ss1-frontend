import { useAlert } from "@components/Alerts";
import { Add, Edit, Search, Visibility } from "@mui/icons-material";
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
} from "@mui/material";
import { getAllSesiones } from "@services/sesion.service";
import { useEffect, useState } from "react";
import ModalCreateUpdateCita from "./Components/ModalCreateUpdateCita";
import ModalViewDetallesSesion from "./Components/ModalViewDetallesSesion";

const Citas = () => {
  const { AlertError } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalViewDetallesOpen, setModalViewDetallesOpen] = useState(false);
  const [sesionData, setSesionData] = useState<any>();
  const [sesionIdDetalles, setSesionIdDetalles] = useState<number | null>(null);
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
      const res = await getAllSesiones();
      console.log("Respuesta de sesiones psicológicas:", res);

      // El backend devuelve: { code: 200, message: "...", responseObject: [...] }
      let sesiones: any[] = [];
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        sesiones = res.responseObject;
      } else if (Array.isArray(res)) {
        sesiones = res;
      }

      // Aplicar filtro si existe
      if (filter) {
        const filterLower = filter.toLowerCase();
        sesiones = sesiones.filter((s: any) => 
          (s.tratamiento?.paciente?.nombre || "").toLowerCase().includes(filterLower) ||
          (s.tratamiento?.paciente?.apellido || "").toLowerCase().includes(filterLower) ||
          (s.tratamiento?.psicologo?.nombre || "").toLowerCase().includes(filterLower) ||
          (s.tratamiento?.psicologo?.apellido || "").toLowerCase().includes(filterLower) ||
          (s.fechaSesion || "").toLowerCase().includes(filterLower) ||
          (s.observaciones || "").toLowerCase().includes(filterLower) ||
          (s.tratamiento?.estadoTratamiento || "").toLowerCase().includes(filterLower)
        );
      }

      setTotal(sesiones.length);

      // Aplicar paginación
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      setRows(sesiones.slice(startIndex, endIndex));
      
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching sesiones:", error);
      setLoading(false);
      AlertError("Error al cargar las sesiones psicológicas");
      setRows([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  const handleViewDetails = (id: number) => {
    setSesionIdDetalles(id);
    setModalViewDetallesOpen(true);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={"bold"}>Gestión de Citas</Typography>
          <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => { setSesionData(null); setModalCreateOpen(true); }}>
            <Add /> Agendar Cita
          </Button>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField 
          label="Buscar por paciente, psicólogo, fecha o observaciones" 
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
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Paciente</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Psicólogo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha de Sesión</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Observaciones</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado Tratamiento</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={7} align="center"><CircularProgress size={28} /></TableCell></TableRow> :
                  rows.length > 0 ? rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.id || "-"}</TableCell>
                      <TableCell>
                        {row.tratamiento?.paciente
                          ? `${row.tratamiento.paciente.nombre || ""} ${row.tratamiento.paciente.apellido || ""}`.trim() || row.tratamiento.paciente.dpi || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.tratamiento?.psicologo
                          ? `${row.tratamiento.psicologo.nombre || ""} ${row.tratamiento.psicologo.apellido || ""}`.trim() || row.tratamiento.psicologo.dpi || "-"
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.fechaSesion
                          ? new Date(row.fechaSesion).toLocaleDateString("es-GT")
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
                        {row.tratamiento?.estadoTratamiento || "-"}
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
                          <Tooltip title="Editar">
                            <IconButton 
                              color="primary" 
                              onClick={() => { setSesionData(row); setModalCreateOpen(true); }} 
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={7} align="center"><Typography sx={{ opacity: 0.7 }}>No hay sesiones psicológicas registradas.</Typography></TableCell></TableRow>}
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
      <ModalCreateUpdateCita 
        open={modalCreateOpen} 
        onClose={() => {
          setModalCreateOpen(false);
          setSesionData(null);
        }} 
        refresh={refresh} 
        setRefresh={setRefresh} 
        sesionData={sesionData} 
      />
      <ModalViewDetallesSesion
        open={modalViewDetallesOpen}
        onClose={() => {
          setModalViewDetallesOpen(false);
          setSesionIdDetalles(null);
        }}
        sesionId={sesionIdDetalles}
      />
    </>
  );
};

export default Citas;
