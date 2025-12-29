import { useAlert } from "@components/Alerts";
import { Add, Edit, Search, Delete } from "@mui/icons-material";
import { deleteEmpleado } from "@services/empleado.service";
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
import { getAllEmpleados } from "@services/empleado.service";
import { useEffect, useState } from "react";
import ModalCreateUpdateEmpleado from "./Components/ModalCreateUpdateEmpleado";

const Empleados = () => {
  const { AlertError, AlertSuccess, AlertApproveDelete } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [empleadoData, setEmpleadoData] = useState<any>();
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
      const res = await getAllEmpleados();
      console.log("Respuesta de empleados:", res);
      
      // El backend devuelve: { code: 200, message: "...", responseObject: [...] }
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        let empleados = res.responseObject;
        
        // Aplicar filtro si existe
        if (filter) {
          const filterLower = filter.toLowerCase();
          empleados = empleados.filter((emp: any) => 
            (emp.nombre || "").toLowerCase().includes(filterLower) ||
            (emp.apellido || "").toLowerCase().includes(filterLower) ||
            (emp.email || "").toLowerCase().includes(filterLower) ||
            (emp.rolEmpleado?.rol || "").toLowerCase().includes(filterLower)
          );
        }
        
        setTotal(empleados.length);
        
        // Aplicar paginación
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        setRows(empleados.slice(startIndex, endIndex));
      } else if (Array.isArray(res)) {
        setRows(res);
        setTotal(res.length);
      } else {
        setRows([]);
        setTotal(0);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error cargando empleados:", error);
      setLoading(false);
      AlertError("Error al cargar los empleados");
      setRows([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  const handleDelete = (row: any) => {
    const nombreCompleto = `${row.nombre || ""} ${row.apellido || ""}`.trim() || "este empleado";
    const dpi = row.dpi || "";
    
    if (!dpi) {
      AlertError("No se pudo obtener el DPI del empleado");
      return;
    }

    AlertApproveDelete(
      "Eliminar Empleado",
      `¿Estás seguro de que deseas eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`,
      "warning",
      "Sí, eliminar",
      "Cancelar"
    ).then((confirmed) => {
      if (confirmed) {
        deleteEmpleado(dpi)
          .then((res: any) => {
            console.log("Empleado eliminado:", res);
            AlertSuccess("Empleado eliminado exitosamente");
            setRefresh(refresh + 1);
          })
          .catch((error: any) => {
            console.error("Error eliminando empleado:", error);
            const errorMsg =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Ocurrió un error al eliminar el empleado";
            AlertError(errorMsg);
          });
      }
    });
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={"bold"}>Gestión de Empleados</Typography>
          <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => { setEmpleadoData(null); setModalCreateOpen(true); }}>
            <Add /> Registrar Empleado
          </Button>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField label="Buscar" variant="outlined" fullWidth sx={{ mb: 2 }} value={filter} onChange={(e) => { setPage(0); setFilter(e.target.value); }}
          slotProps={{ input: { endAdornment: <InputAdornment position="end"><Search /></InputAdornment> } }} />
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Salario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={7} align="center"><CircularProgress size={28} /></TableCell></TableRow> :
                  rows.length > 0 ? rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.nombre || "-"}</TableCell>
                      <TableCell>{row.apellido || "-"}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell>{row.telefono || "-"}</TableCell>
                      <TableCell>{row.rolEmpleado?.rol || "-"}</TableCell>
                      <TableCell>Q {row.salario?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setEmpleadoData(row);
                                setModalCreateOpen(true);
                              }}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(row)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={7} align="center"><Typography sx={{ opacity: 0.7 }}>No hay empleados registrados.</Typography></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={total} page={page} onPageChange={(e, newPage) => { e; setPage(newPage); }} rowsPerPageOptions={[5, 10, 25, 50]} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Cantidad por página" />
        </Paper>
      </Box>
      <ModalCreateUpdateEmpleado
        open={modalCreateOpen}
        onClose={() => {
          setModalCreateOpen(false);
          setEmpleadoData(null);
        }}
        refresh={refresh}
        setRefresh={setRefresh}
        empleadoData={empleadoData}
      />
    </>
  );
};

export default Empleados;
