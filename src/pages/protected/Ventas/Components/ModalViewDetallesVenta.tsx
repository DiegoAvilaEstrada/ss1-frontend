import { useAlert } from "@components/Alerts";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { getDetalleFacturaById } from "@services/detalleFactura.service";
import { useEffect, useState } from "react";

export default function ModalViewDetallesVenta({
  open,
  onClose,
  detalleId,
}: {
  open: boolean;
  onClose: () => void;
  detalleId: number | null;
}) {
  const { AlertError } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [detalle, setDetalle] = useState<any>(null);

  useEffect(() => {
    if (open && detalleId) {
      loadDetalle();
    } else {
      setDetalle(null);
    }
  }, [open, detalleId]);

  const loadDetalle = async () => {
    if (!detalleId) return;
    
    setLoading(true);
    try {
      const res = await getDetalleFacturaById(detalleId);
      console.log("Detalle de factura obtenido:", res);
      
      // El backend devuelve: { code: 200, message: "...", responseObject: {...} }
      if (res?.responseObject) {
        setDetalle(res.responseObject);
      } else if (res?.id) {
        setDetalle(res);
      }
    } catch (error: any) {
      console.error("Error cargando detalle de factura:", error);
      AlertError("Error al cargar los detalles de la venta");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"success.main"} color="white">
        Detalles de la Venta
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : detalle ? (
          <Stack spacing={3} mt={1}>
            {/* Información del Detalle de Venta */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Información del Detalle de Venta
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    ID del Detalle
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {detalle.id || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cantidad
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {detalle.cantidad || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Costo Total
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    Q {detalle.costoTotal?.toFixed(2) || "0.00"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Información del Producto */}
            {detalle.producto && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Producto
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      ID del Producto
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.producto.id || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre del Producto
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.producto.nombreProducto || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Precio de Venta
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Q {detalle.producto.precioVenta?.toFixed(2) || "0.00"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.producto.descripcion || "-"}
                    </Typography>
                  </Grid>
                  {detalle.producto.tipoProducto && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de Producto
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {detalle.producto.tipoProducto.nombreTipo || "-"}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Información de la Factura */}
            {detalle.factura && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información de la Factura
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      ID de la Factura
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.id || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Emisión
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.fechaEmision
                        ? new Date(detalle.factura.fechaEmision).toLocaleDateString("es-GT")
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Monto Total de la Factura
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary.main">
                      Q {detalle.factura.montoTotal?.toFixed(2) || "0.00"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Información del Paciente */}
            {detalle.factura?.paciente && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Paciente
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      DPI
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.paciente.dpi || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {`${detalle.factura.paciente.nombre || ""} ${detalle.factura.paciente.apellido || ""}`.trim() ||
                        "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.paciente.telefono || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.paciente.email || "-"}
                    </Typography>
                  </Grid>
                  {detalle.factura.paciente.nit && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        NIT
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {detalle.factura.paciente.nit || "-"}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Información del Tratamiento */}
            {detalle.factura?.tratamiento && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Tratamiento
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      ID del Tratamiento
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.tratamiento.id || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {detalle.factura.tratamiento.fechaInicio
                        ? new Date(detalle.factura.tratamiento.fechaInicio).toLocaleDateString("es-GT")
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Estado del Tratamiento
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={detalle.factura.tratamiento.estadoTratamiento || detalle.factura.tratamiento.estado || "Sin estado"}
                        size="small"
                        color={
                          (detalle.factura.tratamiento.estadoTratamiento || detalle.factura.tratamiento.estado || "").toUpperCase() ===
                          "EN PROCESO"
                            ? "info"
                            : (detalle.factura.tratamiento.estadoTratamiento || detalle.factura.tratamiento.estado || "").toUpperCase() ===
                              "FINALIZADO"
                            ? "success"
                            : (detalle.factura.tratamiento.estadoTratamiento || detalle.factura.tratamiento.estado || "").toUpperCase() ===
                              "CANCELADO"
                            ? "error"
                            : "default"
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Requiere Medicación
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={detalle.factura.tratamiento.medicado ? "Sí" : "No"}
                        size="small"
                        color={detalle.factura.tratamiento.medicado ? "info" : "default"}
                      />
                    </Box>
                  </Grid>
                  {detalle.factura.tratamiento.psicologo && (
                    <>
                      <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Psicólogo Asignado
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          DPI
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {detalle.factura.tratamiento.psicologo.dpi || "-"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Nombre Completo
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {`${detalle.factura.tratamiento.psicologo.nombre || ""} ${detalle.factura.tratamiento.psicologo.apellido || ""}`.trim() ||
                            "-"}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No se pudo cargar la información de la venta.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="success">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

