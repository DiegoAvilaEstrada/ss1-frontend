import { useAlert } from "@components/Alerts";
import { Add, Edit, Search, Warning, TrendingDown } from "@mui/icons-material";
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
  Alert,
} from "@mui/material";
import { getAllInventario, getItemsMinimos, registrarEntrada, registrarSalida } from "@services/inventario.service";
import { useEffect, useState } from "react";
import ModalCreateUpdateItem from "./Components/ModalCreateUpdateItem";
import ModalMovimiento from "./Components/ModalMovimiento";

const Inventario = () => {
  const { AlertError } = useAlert();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalMovimientoOpen, setModalMovimientoOpen] = useState(false);
  const [itemData, setItemData] = useState<any>();
  const [tipoMovimiento, setTipoMovimiento] = useState<"entrada" | "salida">("entrada");
  const [rows, setRows] = useState<any[]>([]);
  const [itemsMinimos, setItemsMinimos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filter, setFilter] = useState<string>("");
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState<number>(0);

  const [allRows, setAllRows] = useState<any[]>([]); // Almacena todos los items del inventario

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllInventario();
      console.log("Respuesta de inventario:", response);
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
    } catch (error) {
      console.error("Error fetching inventario:", error);
      AlertError("Error al cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsMinimos = async () => {
    // TODO: Implementar cuando el endpoint esté disponible
    // Por ahora, calculamos los items con stock mínimo del lado del cliente
    const minimos = allRows.filter((item) => item.stock <= item.minimoStock);
    setItemsMinimos(minimos);
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    fetchItemsMinimos();
  }, [allRows]);

  // Filtrado y paginación del lado del cliente
  useEffect(() => {
    const filtered = allRows.filter(
      (item) =>
        item.producto?.nombreProducto?.toLowerCase().includes(filter.toLowerCase()) ||
        item.producto?.descripcion?.toLowerCase().includes(filter.toLowerCase()) ||
        item.producto?.tipoProducto?.nombreTipo?.toLowerCase().includes(filter.toLowerCase())
    );
    setTotal(filtered.length);
    setRows(filtered.slice(page * pageSize, page * pageSize + pageSize));
  }, [page, pageSize, filter, allRows]);

  const handleMovimiento = (row: any, tipo: "entrada" | "salida") => {
    setItemData(row);
    setTipoMovimiento(tipo);
    setModalMovimientoOpen(true);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={"bold"}>Gestión de Inventario</Typography>
          <Button variant="contained" color="success" sx={{ textTransform: "none" }} onClick={() => { setItemData(null); setModalCreateOpen(true); }}>
            <Add /> Agregar Producto
          </Button>
        </Box>
        <Divider sx={{ mt: 1, mb: 3 }} />

        {itemsMinimos.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Warning /> Hay {itemsMinimos.length} item(s) con stock mínimo
            </Box>
          </Alert>
        )}

        <TextField
          label="Buscar por nombre, descripción o tipo de producto"
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
                  <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock Mínimo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Precio de Venta</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ventas Realizadas</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={row.id || index}>
                      <TableCell>{row.producto?.nombreProducto || "-"}</TableCell>
                      <TableCell>{row.producto?.descripcion || "-"}</TableCell>
                      <TableCell>{row.producto?.tipoProducto?.nombreTipo || "-"}</TableCell>
                      <TableCell>{row.stock ?? 0}</TableCell>
                      <TableCell>{row.minimoStock ?? 0}</TableCell>
                      <TableCell>Q {row.producto?.precioVenta?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>{row.ventasRealizadas ?? 0}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.stock <= row.minimoStock ? "Stock Mínimo" : "Disponible"}
                          color={row.stock <= row.minimoStock ? "warning" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Entrada">
                            <IconButton
                              color="success"
                              onClick={() => handleMovimiento(row, "entrada")}
                              size="small"
                            >
                              <TrendingDown />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Salida">
                            <IconButton
                              color="error"
                              onClick={() => handleMovimiento(row, "salida")}
                              size="small"
                            >
                              <TrendingDown />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setItemData(row);
                                setModalCreateOpen(true);
                              }}
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
                    <TableCell colSpan={9} align="center">
                      <Typography sx={{ opacity: 0.7 }}>No hay items en inventario.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={total} page={page} onPageChange={(e, newPage) => { e; setPage(newPage); }} rowsPerPageOptions={[5, 10, 25, 50]} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} labelRowsPerPage="Cantidad por página" />
        </Paper>
      </Box>

      <ModalCreateUpdateItem open={modalCreateOpen} onClose={() => setModalCreateOpen(false)} refresh={refresh} setRefresh={setRefresh} itemData={itemData} />
      <ModalMovimiento open={modalMovimientoOpen} onClose={() => setModalMovimientoOpen(false)} refresh={refresh} setRefresh={setRefresh} itemData={itemData} tipo={tipoMovimiento} />
    </>
  );
};

export default Inventario;
