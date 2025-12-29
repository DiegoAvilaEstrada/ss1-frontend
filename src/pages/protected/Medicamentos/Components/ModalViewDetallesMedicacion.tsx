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
import { getMedicacionById } from "@services/medicacion.service";
import { useEffect, useState } from "react";

export default function ModalViewDetallesMedicacion({
  open,
  onClose,
  medicacionId,
}: {
  open: boolean;
  onClose: () => void;
  medicacionId: number | null;
}) {
  const { AlertError } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [medicacion, setMedicacion] = useState<any>(null);

  useEffect(() => {
    if (open && medicacionId) {
      loadMedicacion();
    } else {
      setMedicacion(null);
    }
  }, [open, medicacionId]);

  const loadMedicacion = async () => {
    if (!medicacionId) return;
    
    setLoading(true);
    try {
      const res = await getMedicacionById(medicacionId);
      console.log("Medicación obtenida:", res);
      
      // El backend devuelve: { code: 200, message: "...", responseObject: {...} }
      if (res?.responseObject) {
        setMedicacion(res.responseObject);
      } else if (res?.id) {
        setMedicacion(res);
      }
    } catch (error: any) {
      console.error("Error cargando medicación:", error);
      AlertError("Error al cargar los detalles de la medicación");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"info.main"} color="white">
        Detalles de la Medicación
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : medicacion ? (
          <Stack spacing={3} mt={1}>
            {/* Información de la Medicación */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Información de la Medicación
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID de la Medicación
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {medicacion.id || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Dosis
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {medicacion.dosis || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Frecuencia
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {medicacion.frecuencia || "Sin frecuencia especificada"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Información del Producto */}
            {medicacion.producto && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Producto/Medicamento
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ID del Producto
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.producto.id || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre del Producto
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.producto.nombreProducto || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Precio de Venta
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Q {medicacion.producto.precioVenta?.toFixed(2) || "0.00"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.producto.descripcion || "-"}
                    </Typography>
                  </Grid>
                  {medicacion.producto.tipoProducto && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de Producto
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {medicacion.producto.tipoProducto.nombreTipo || "-"}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Información del Tratamiento */}
            {medicacion.tratamiento && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Tratamiento
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ID del Tratamiento
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.id || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.fechaInicio
                        ? new Date(medicacion.tratamiento.fechaInicio).toLocaleDateString("es-GT")
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Estado del Tratamiento
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={medicacion.tratamiento.estadoTratamiento || medicacion.tratamiento.estado || "Sin estado"}
                        size="small"
                        color={
                          (medicacion.tratamiento.estadoTratamiento || medicacion.tratamiento.estado || "").toUpperCase() ===
                          "EN PROCESO"
                            ? "info"
                            : (medicacion.tratamiento.estadoTratamiento || medicacion.tratamiento.estado || "").toUpperCase() ===
                              "FINALIZADO"
                            ? "success"
                            : (medicacion.tratamiento.estadoTratamiento || medicacion.tratamiento.estado || "").toUpperCase() ===
                              "CANCELADO"
                            ? "error"
                            : "default"
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Requiere Medicación
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={medicacion.tratamiento.medicado ? "Sí" : "No"}
                        size="small"
                        color={medicacion.tratamiento.medicado ? "info" : "default"}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Información del Paciente */}
            {medicacion.tratamiento?.paciente && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Paciente
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      DPI
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.paciente.dpi || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {`${medicacion.tratamiento.paciente.nombre || ""} ${medicacion.tratamiento.paciente.apellido || ""}`.trim() ||
                        "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.paciente.telefono || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.paciente.email || "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Información del Psicólogo */}
            {medicacion.tratamiento?.psicologo && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Psicólogo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      DPI
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.psicologo.dpi || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {`${medicacion.tratamiento.psicologo.nombre || ""} ${medicacion.tratamiento.psicologo.apellido || ""}`.trim() ||
                        "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.psicologo.telefono || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {medicacion.tratamiento.psicologo.email || "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No se pudo cargar la información de la medicación.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="info">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

