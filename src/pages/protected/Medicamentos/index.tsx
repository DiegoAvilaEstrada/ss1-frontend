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
import { getAllMedicaciones } from "@services/medicacion.service";
import { useEffect, useState } from "react";
import ModalCreateUpdateMedicacion from "./Components/ModalCreateUpdateMedicacion";
import ModalViewDetallesMedicacion from "./Components/ModalViewDetallesMedicacion";

const Medicamentos = () => {
  const { AlertError } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalViewDetallesOpen, setModalViewDetallesOpen] = useState(false);
  const [medicacionData, setMedicacionData] = useState<any>();
  const [medicacionIdDetalles, setMedicacionIdDetalles] = useState<number | null>(null);
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
      const res = await getAllMedicaciones();
      console.log("Respuesta de medicaciones:", res);

      // El backend devuelve: { code: 200, message: "...", responseObject: [...] }
      let medicaciones: any[] = [];
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        medicaciones = res.responseObject;
      } else if (Array.isArray(res)) {
        medicaciones = res;
      }

      // Aplicar filtro si existe
      if (filter) {
        const filterLower = filter.toLowerCase();
        medicaciones = medicaciones.filter((m: any) => 
          (m.tratamiento?.paciente?.nombre || "").toLowerCase().includes(filterLower) ||
          (m.tratamiento?.paciente?.apellido || "").toLowerCase().includes(filterLower) ||
          (m.producto?.nombreProducto || "").toLowerCase().includes(filterLower) ||
          (m.dosis || "").toLowerCase().includes(filterLower) ||
          (m.frecuencia || "").toLowerCase().includes(filterLower) ||
          (m.tratamiento?.estadoTratamiento || "").toLowerCase().includes(filterLower)
        );
      }

      setTotal(medicaciones.length);

      // Aplicar paginación
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      setRows(medicaciones.slice(startIndex, endIndex));
      
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching medicaciones:", error);
      setLoading(false);
      AlertError("Error al cargar las medicaciones");
      setRows([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  const handleViewDetails = (id: number) => {
    setMedicacionIdDetalles(id);
    setModalViewDetallesOpen(true);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={"bold"}>Gestión de Medicamentos</Typography>
          <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => { setMedicacionData(null); setModalCreateOpen(true); }}>
            <Add /> Agregar Medicación
          </Button>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField 
          label="Buscar por paciente, medicamento, dosis o frecuencia" 
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
                  <TableCell sx={{ fontWeight: "bold" }}>Medicamento</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Dosis</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Frecuencia</TableCell>
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
                        {row.producto?.nombreProducto || "-"}
                      </TableCell>
                      <TableCell>{row.dosis || "-"}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={row.frecuencia || "-"}
                        >
                          {row.frecuencia || "-"}
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
                              onClick={() => { setMedicacionData(row); setModalCreateOpen(true); }} 
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={7} align="center"><Typography sx={{ opacity: 0.7 }}>No hay medicaciones registradas.</Typography></TableCell></TableRow>}
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
      <ModalCreateUpdateMedicacion 
        open={modalCreateOpen} 
        onClose={() => {
          setModalCreateOpen(false);
          setMedicacionData(null);
        }} 
        refresh={refresh} 
        setRefresh={setRefresh} 
        medicacionData={medicacionData} 
      />
      <ModalViewDetallesMedicacion
        open={modalViewDetallesOpen}
        onClose={() => {
          setModalViewDetallesOpen(false);
          setMedicacionIdDetalles(null);
        }}
        medicacionId={medicacionIdDetalles}
      />
    </>
  );
};

export default Medicamentos;
