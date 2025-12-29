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
} from "@mui/material";
import { getAllEmpleados } from "@services/empleado.service";
import { useEffect, useState } from "react";

const Nomina = () => {
  const { AlertError } = useAlert();
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
            (emp.salario?.toString() || "").includes(filterLower) ||
            (emp.descuentoIgss?.toString() || "").includes(filterLower)
          );
        }
        
        setTotal(empleados.length);
        
        // Aplicar paginación
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        setRows(empleados.slice(startIndex, endIndex));
      } else if (Array.isArray(res)) {
        setTotal(res.length);
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        setRows(res.slice(startIndex, endIndex));
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

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={"bold"}>Nómina de Empleados</Typography>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField 
          label="Buscar por nombre, apellido, salario o descuento IGS" 
          variant="outlined" 
          fullWidth 
          sx={{ mb: 2 }} 
          value={filter} 
          onChange={(e) => { setPage(0); setFilter(e.target.value); }}
          slotProps={{ input: { endAdornment: <InputAdornment position="end"><Search /></InputAdornment> } }} 
        />
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Salario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Descuento IGS (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.nombre || "-"}</TableCell>
                      <TableCell>{row.apellido || "-"}</TableCell>
                      <TableCell>Q {row.salario?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>{row.descuentoIgss?.toFixed(2) || "0.00"}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography sx={{ opacity: 0.7 }}>No hay empleados registrados.</Typography>
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
            onPageChange={(e, newPage) => { e; setPage(newPage); }} 
            rowsPerPageOptions={[5, 10, 25, 50]} 
            rowsPerPage={pageSize} 
            onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} 
            labelRowsPerPage="Cantidad por página" 
          />
        </Paper>
      </Box>
    </>
  );
};

export default Nomina;
