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
import { getSesionById } from "@services/sesion.service";
import { useEffect, useState } from "react";

export default function ModalViewDetallesSesion({
  open,
  onClose,
  sesionId,
}: {
  open: boolean;
  onClose: () => void;
  sesionId: number | null;
}) {
  const { AlertError } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [sesion, setSesion] = useState<any>(null);

  useEffect(() => {
    if (open && sesionId) {
      loadSesion();
    } else {
      setSesion(null);
    }
  }, [open, sesionId]);

  const loadSesion = async () => {
    if (!sesionId) return;
    
    setLoading(true);
    try {
      const res = await getSesionById(sesionId);
      console.log("Sesión obtenida:", res);
      
      // El backend devuelve: { code: 200, message: "...", responseObject: {...} }
      if (res?.responseObject) {
        setSesion(res.responseObject);
      } else if (res?.id) {
        setSesion(res);
      }
    } catch (error: any) {
      console.error("Error cargando sesión:", error);
      AlertError("Error al cargar los detalles de la sesión");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"info.main"} color="white">
        Detalles de la Sesión Psicológica
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : sesion ? (
          <Stack spacing={3} mt={1}>
            {/* Información de la Sesión */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Información de la Sesión
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    ID de la Sesión
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {sesion.id || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Sesión
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {sesion.fechaSesion
                      ? new Date(sesion.fechaSesion).toLocaleDateString("es-GT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Observaciones
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {sesion.observaciones || "Sin observaciones"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Información del Tratamiento */}
            {sesion.tratamiento && (
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
                      {sesion.tratamiento.id || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Inicio del Tratamiento
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sesion.tratamiento.fechaInicio
                        ? new Date(sesion.tratamiento.fechaInicio).toLocaleDateString("es-GT")
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Estado del Tratamiento
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={sesion.tratamiento.estadoTratamiento || sesion.tratamiento.estado || "Sin estado"}
                        size="small"
                        color={
                          (sesion.tratamiento.estadoTratamiento || sesion.tratamiento.estado || "").toUpperCase() ===
                          "EN PROCESO"
                            ? "info"
                            : (sesion.tratamiento.estadoTratamiento || sesion.tratamiento.estado || "").toUpperCase() ===
                              "FINALIZADO"
                            ? "success"
                            : (sesion.tratamiento.estadoTratamiento || sesion.tratamiento.estado || "").toUpperCase() ===
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
                        label={sesion.tratamiento.medicado ? "Sí" : "No"}
                        size="small"
                        color={sesion.tratamiento.medicado ? "info" : "default"}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Información del Paciente */}
            {sesion.tratamiento?.paciente && (
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
                      {sesion.tratamiento.paciente.dpi || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {`${sesion.tratamiento.paciente.nombre || ""} ${sesion.tratamiento.paciente.apellido || ""}`.trim() ||
                        "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sesion.tratamiento.paciente.telefono || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sesion.tratamiento.paciente.email || "-"}
                    </Typography>
                  </Grid>
                  {sesion.tratamiento.paciente.nit && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        NIT
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {sesion.tratamiento.paciente.nit || "-"}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Información del Psicólogo */}
            {sesion.tratamiento?.psicologo && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información del Psicólogo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                 
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre Completo
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {`${sesion.tratamiento.psicologo.nombre || ""} ${sesion.tratamiento.psicologo.apellido || ""}`.trim() ||
                        "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sesion.tratamiento.psicologo.telefono || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sesion.tratamiento.psicologo.email || "-"}
                    </Typography>
                  </Grid>
                
                </Grid>
              </Box>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No se pudo cargar la información de la sesión.
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

