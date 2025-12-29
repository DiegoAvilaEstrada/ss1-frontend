import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getFacturaById } from "@services/facturacion.service";
import { useEffect, useState } from "react";
import { Receipt } from "@mui/icons-material";

export default function ModalDetalleFactura({
  open,
  onClose,
  facturaId,
}: {
  open: boolean;
  onClose: () => void;
  facturaId: number | null;
}) {
  const [factura, setFactura] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && facturaId) {
      setLoading(true);
      getFacturaById(facturaId)
        .then((res: any) => {
          console.log("Detalle de factura:", res);
          if (res?.responseObject) {
            setFactura(res.responseObject);
          } else if (res) {
            setFactura(res);
          }
        })
        .catch((error) => {
          console.error("Error cargando detalle de factura:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setFactura(null);
    }
  }, [open, facturaId]);

  const getEstadoColor = (estado: string) => {
    const estadoUpper = estado?.toUpperCase() || "";
    if (estadoUpper.includes("PAGADA") || estadoUpper.includes("PAGADO")) {
      return "success";
    }
    if (estadoUpper.includes("PENDIENTE")) {
      return "warning";
    }
    if (estadoUpper.includes("ANULADA") || estadoUpper.includes("ANULADO")) {
      return "error";
    }
    return "default";
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        bgcolor={"primary.main"}
        color="white"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Receipt />
        Detalle de Factura #{facturaId}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : factura ? (
          <Box>
            {/* Información General */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Información General
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Número de Factura
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    #{factura.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Emisión
                  </Typography>
                  <Typography variant="body1">
                    {factura.fechaEmision
                      ? new Date(factura.fechaEmision).toLocaleDateString("es-GT")
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado
                  </Typography>
                  <Chip
                    label={factura.estado || "Pendiente"}
                    color={getEstadoColor(factura.estado)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Q {factura.total?.toFixed(2) || factura.montoTotal?.toFixed(2) || "0.00"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Información del Paciente */}
            {factura.paciente && (
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Información del Paciente
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1">
                      {factura.paciente.nombre} {factura.paciente.apellido}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      DPI
                    </Typography>
                    <Typography variant="body1">{factura.paciente.dpi || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{factura.paciente.email || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1">{factura.paciente.telefono || "-"}</Typography>
                  </Grid>
                  {factura.paciente.nit && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        NIT
                      </Typography>
                      <Typography variant="body1">{factura.paciente.nit}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Información del Tratamiento */}
            {factura.tratamiento && (
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Información del Tratamiento
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ID de Tratamiento
                    </Typography>
                    <Typography variant="body1">#{factura.tratamiento.id}</Typography>
                  </Grid>
                  {factura.tratamiento.diagnostico && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Diagnóstico
                      </Typography>
                      <Typography variant="body1">{factura.tratamiento.diagnostico}</Typography>
                    </Grid>
                  )}
                  {factura.tratamiento.fechaInicio && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Inicio
                      </Typography>
                      <Typography variant="body1">
                        {new Date(factura.tratamiento.fechaInicio).toLocaleDateString("es-GT")}
                      </Typography>
                    </Grid>
                  )}
                  {factura.tratamiento.fechaFin && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Fin
                      </Typography>
                      <Typography variant="body1">
                        {new Date(factura.tratamiento.fechaFin).toLocaleDateString("es-GT")}
                      </Typography>
                    </Grid>
                  )}
                  {factura.tratamiento.estado && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Estado del Tratamiento
                      </Typography>
                      <Typography variant="body1">{factura.tratamiento.estado}</Typography>
                    </Grid>
                  )}
                  {factura.tratamiento.psicologo && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Psicólogo Asignado
                      </Typography>
                      <Typography variant="body1">
                        {factura.tratamiento.psicologo.nombre}{" "}
                        {factura.tratamiento.psicologo.apellido}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Detalle de la Factura */}
            {factura.detalleFactura && factura.detalleFactura.length > 0 && (
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Detalle de Productos/Servicios
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Producto/Servicio</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Cantidad
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Precio Unitario
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Subtotal
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {factura.detalleFactura.map((detalle: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {detalle.producto?.nombreProducto || "Producto"}
                            {detalle.producto?.descripcion && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {detalle.producto.descripcion}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">{detalle.cantidad || 1}</TableCell>
                          <TableCell align="right">
                            Q {detalle.precioUnitario?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell align="right">
                            Q {detalle.subtotal?.toFixed(2) || "0.00"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total: Q{" "}
                    {factura.total?.toFixed(2) || factura.montoTotal?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        ) : (
          <Typography>No se pudo cargar la información de la factura</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

