import { useAlert } from "@components/Alerts";
import { Add, Block, Check, Edit, Search } from "@mui/icons-material";
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
import {
  activateUser,
  desactivateUser,
  getAllUsers,
} from "@services/user.service";
import { useEffect, useState } from "react";
import ModalCreateUpdateUser from "./Components/ModalCreateUpdateUser";
interface PropsActionsCell {
  row: any;
}
const index = () => {
  const { AlertApproveDelete, AlertSuccess, AlertError } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [userData, setUserData] = useState<any>();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    const params = {
      page: page + 1,
      size: pageSize,
      filter,
    };
    getAllUsers(params)
      .then((res) => {
        if ((res.status = 200)) {
          setRows(res.data);
          setTotal(res.pagination.total);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filter, refresh]);

  //   const onToggleTfa = (row: any) => {
  //     const status = row.userTwoFactor?.enabled;
  //     const name = `${row.name} ${row.lastName}`;
  //     AlertApproveDelete(
  //       `${status ? "Desactivar" : "Activar"}`,
  //       `${
  //         status
  //           ? `Esta accion desabilitara el inicio de sesion con token para el usuario ${name}`
  //           : `Esta accion habilitara el inicio de sesion con token para el usuario ${name}`
  //       }`,
  //       "warning",
  //       `Si, ${status ? "deshabilitar" : "Habilitar"}`,
  //       "Cancelar"
  //     ).then((res) => {
  //       if (res) {
  //       }
  //     });
  //   };

  const onEdit = (row: any) => {
    setUserData(row);
    setModalCreateOpen(true);
  };

  const onToggleStatus = (row: any) => {
    const status = row.status;
    const name = `${row.name} ${row.lastName}`;
    const title = status ? "Desactivar" : "Activar";

    const message = status
      ? `Esta accion desabilitara el usuario ${name}`
      : `Esta accion habilitara el usuario ${name} `;
    AlertApproveDelete(
      title,
      message,
      "warning",
      `Si, ${status ? "Desactivar" : "Activar"}`,
      "Cancelar"
    ).then((res) => {
      if (res) {
        if (status) {
          handleDesactivateUser(row.id);
        } else {
          handleActivateUser(row.id);
        }
      }
    });
  };

  const ActionsCell = ({ row }: PropsActionsCell) => {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {/* <Tooltip
            title={
                row.userTwoFactor?.enabled ? "Deshabilitar TFA" : "Habilitar TFA"
            }
            >
            <IconButton
                color={row.userTwoFactor?.enabled ? "warning" : "success"}
                onClick={() => onToggleTfa(row)}
                size="small"
            >
                {row.userTwoFactor?.enabled ? <RemoveCircleOutline /> : <DoneAll />}
            </IconButton>
            </Tooltip> */}

        <Tooltip title={row.status ? "Desactivar usuario" : "Activar usuario"}>
          <IconButton
            color={row.status ? "error" : "success"}
            onClick={() => onToggleStatus(row)}
            size="small"
          >
            {row.status ? <Block /> : <Check />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Editar usuario">
          <IconButton color="primary" onClick={() => onEdit(row)} size="small">
            <Edit />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const handleDesactivateUser = (id: number) => {
    desactivateUser(id)
      .then(() => {
        AlertSuccess("Usuario desactivado");
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        AlertError(
          String(
            error?.response?.data?.message ||
              "Ocurrio un error, intentelo de nuevo"
          )
        );
      });
  };
  const handleActivateUser = (id: number) => {
    activateUser(id)
      .then(() => {
        AlertSuccess("Usuario desactivado");
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        AlertError(
          String(
            error?.response?.data?.message ||
              "Ocurrio un error, intentelo de nuevo"
          )
        );
      });
  };

  const handleOpenCreate = () => {
    setUserData(null);
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
            Gestion de Usuarios
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
            onClick={() => handleOpenCreate()}
          >
            <Add />
            Crear usuario
          </Button>
        </Box>

        <Divider sx={{ mt: 1, mb: 3 }} />
        <TextField
          label="Buscar por nombre"
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
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Doble factor
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${row.name} ${row.lastName}`}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role?.name}</TableCell>
                      <TableCell>
                        {row.status ? "Activo" : "Inactivo"}{" "}
                      </TableCell>
                      <TableCell>
                        {row.userTwoFactor?.enabled ? "Activo" : "Inactivo"}
                      </TableCell>
                      <TableCell>
                        <ActionsCell row={row} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography sx={{ opacity: 0.7 }}>
                        No hay datos para mostrar.
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

      <ModalCreateUpdateUser
        open={modalCreateOpen}
        onClose={() => setModalCreateOpen(false)}
        refresh={refresh}
        setRefresh={setRefresh}
        userData={userData}
      />
    </>
  );
};

export default index;
