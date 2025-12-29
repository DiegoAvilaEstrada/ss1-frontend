import { useAlert } from "@components/Alerts";
import { Add, Edit, Search, Visibility, Person, Delete } from "@mui/icons-material";
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
import { getAllPacientes, deletePaciente } from "@services/paciente.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRole } from "@utilities/Functions";
import ModalCreateUpdatePaciente from "./Components/ModalCreateUpdatePaciente";
import ModalPerfilPaciente from "./Components/ModalPerfilPaciente";

interface PropsActionsCell {
  row: any;
}

const Pacientes = () => {
  const { AlertError, AlertSuccess, AlertApproveDelete } = useAlert();
  const navigate = useNavigate();
  const role = getRole();
  const canDelete = role === "ADMIN"; // Solo ADMIN puede eliminar pacientes
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [pacienteData, setPacienteData] = useState<any>();
  const [pacienteDpiPerfil, setPacienteDpiPerfil] = useState<string | null>(null);
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
      const res = await getAllPacientes();
      console.log("Respuesta de pacientes:", res);
      
      // El backend devuelve: { code: 200, message: "...", responseObject: [...] }
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        let pacientes = res.responseObject;
        
        // Aplicar filtro si existe
        if (filter) {
          const filterLower = filter.toLowerCase();
          pacientes = pacientes.filter((pac: any) => 
            (pac.nombre || "").toLowerCase().includes(filterLower) ||
            (pac.apellido || "").toLowerCase().includes(filterLower) ||
            (pac.email || "").toLowerCase().includes(filterLower) ||
            (pac.nit || "").toLowerCase().includes(filterLower) ||
            (pac.dpi || "").toLowerCase().includes(filterLower)
          );
        }
        
        setTotal(pacientes.length);
        
        // Aplicar paginación
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        setRows(pacientes.slice(startIndex, endIndex));
      } else if (Array.isArray(res)) {
        setRows(res);
        setTotal(res.length);
      } else {
        setRows([]);
        setTotal(0);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching pacientes:", error);
      setLoading(false);
      AlertError("Error al cargar los pacientes");
      setRows([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  const onEdit = (row: any) => {
    setPacienteData(row);
    setModalCreateOpen(true);
  };

  const onViewPerfil = (row: any) => {
    const dpi = row.dpi || "";
    if (dpi) {
      setPacienteDpiPerfil(dpi);
      setModalPerfilOpen(true);
    }
  };

  const onViewHistorial = (row: any) => {
    // Usar dpi como identificador si no hay id
    const pacienteId = row.id || row.dpi || "";
    navigate(`/historiales?pacienteId=${pacienteId}`);
  };

  const handleDelete = (row: any) => {
    const nombreCompleto = `${row.nombre || ""} ${row.apellido || ""}`.trim() || "este paciente";
    const dpi = row.dpi || "";
    
    if (!dpi) {
      AlertError("No se pudo obtener el DPI del paciente");
      return;
    }

    AlertApproveDelete(
      "Eliminar Paciente",
      `¿Estás seguro de que deseas eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`,
      "warning",
      "Sí, eliminar",
      "Cancelar"
    ).then((confirmed) => {
      if (confirmed) {
        deletePaciente(dpi)
          .then((res: any) => {
            console.log("Paciente eliminado:", res);
            AlertSuccess("Paciente eliminado exitosamente");
            setRefresh(refresh + 1);
          })
          .catch((error: any) => {
            console.error("Error eliminando paciente:", error);
            const errorMsg =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Ocurrió un error al eliminar el paciente";
            AlertError(errorMsg);
          });
      }
    });
  };

  const ActionsCell = ({ row }: PropsActionsCell) => {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Ver perfil completo">
          <IconButton
            color="primary"
            onClick={() => onViewPerfil(row)}
            size="small"
          >
            <Person />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ver historial clínico">
          <IconButton
            color="info"
            onClick={() => onViewHistorial(row)}
            size="small"
          >
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar paciente">
          <IconButton color="secondary" onClick={() => onEdit(row)} size="small">
            <Edit />
          </IconButton>
        </Tooltip>
        {canDelete && (
          <Tooltip title="Eliminar paciente">
            <IconButton
              color="error"
              onClick={() => handleDelete(row)}
              size="small"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  };

  const handleOpenCreate = () => {
    setPacienteData(null);
    setModalCreateOpen(true);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={"bold"}>
            Gestión de Pacientes
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
            onClick={() => handleOpenCreate()}
          >
            <Add />
            Registrar Paciente
          </Button>
        </Box>

        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField
          label="Buscar por nombre, email o NIT"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={filter}
          onChange={(e) => {
            setPage(0);
            setFilter(e.target.value);
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>DPI</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>NIT</TableCell>
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
                    <TableRow key={index}>
                      <TableCell>{row.dpi || "-"}</TableCell>
                      <TableCell>{row.nombre || "-"}</TableCell>
                      <TableCell>{row.apellido || "-"}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell>{row.telefono || "-"}</TableCell>
                      <TableCell>{row.nit || "-"}</TableCell>
                      <TableCell>
                        <ActionsCell row={row} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography sx={{ opacity: 0.7 }}>
                        No hay pacientes registrados.
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

      <ModalCreateUpdatePaciente
        open={modalCreateOpen}
        onClose={() => setModalCreateOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
        pacienteData={pacienteData}
      />

      <ModalPerfilPaciente
        open={modalPerfilOpen}
        onClose={() => {
          setModalPerfilOpen(false);
          setPacienteDpiPerfil(null);
        }}
        pacienteDpi={pacienteDpiPerfil}
        onUpdateSuccess={() => {
          setRefresh(refresh + 1);
        }}
      />
    </>
  );
};

export default Pacientes;
