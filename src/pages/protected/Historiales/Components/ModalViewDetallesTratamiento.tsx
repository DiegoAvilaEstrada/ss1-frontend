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
import { getTratamientoById } from "@services/tratamiento.service";
import { getAllSesiones } from "@services/sesion.service";
import { useEffect, useState } from "react";

export default function ModalViewDetallesTratamiento({
  open,
  onClose,
  tratamientoId,
}: {
  open: boolean;
  onClose: () => void;
  tratamientoId: number | null;
}) {
  const { AlertError } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [tratamiento, setTratamiento] = useState<any>(null);
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [loadingSesiones, setLoadingSesiones] = useState<boolean>(false);

  useEffect(() => {
    if (open && tratamientoId) {
      loadTratamiento();
      loadSesiones();
    } else {
      setTratamiento(null);
      setSesiones([]);
    }
  }, [open, tratamientoId]);

  const loadTratamiento = async () => {
    if (!tratamientoId) return;
    
    setLoading(true);
    try {
      const res = await getTratamientoById(tratamientoId);
      console.log("Tratamiento obtenido:", res);
      
      // El backend devuelve: { code: 200, message: "...", responseObject: {...} }
      if (res?.responseObject) {
        setTratamiento(res.responseObject);
      } else if (res?.id) {
        setTratamiento(res);
      }
    } catch (error: any) {
      console.error("Error cargando tratamiento:", error);
      AlertError("Error al cargar los detalles del tratamiento");
    } finally {
      setLoading(false);
    }
  };

  const loadSesiones = async () => {
    if (!tratamientoId) return;
    
    setLoadingSesiones(true);
    try {
      const res = await getAllSesiones();
      const todasSesiones = res?.responseObject || res || [];
      
      // Filtrar sesiones de este tratamiento
      const sesionesFiltradas = Array.isArray(todasSesiones)
        ? todasSesiones.filter((s: any) => {
            const idTrat = s.tratamiento?.id || s.idTratamiento;
            return String(idTrat) === String(tratamientoId);
          })
        : [];
      
      setSesiones(sesionesFiltradas);
    } catch (error: any) {
      console.error("Error cargando sesiones:", error);
    } finally {
      setLoadingSesiones(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"info.main"} color="white">
        Detalles del Tratamiento
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : tratamiento ? (
          <Stack spacing={3} mt={1}>
            {/* Información General */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID del Tratamiento
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.id || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.fechaInicio
                      ? new Date(tratamiento.fechaInicio).toLocaleDateString("es-GT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado del Tratamiento
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={tratamiento.estadoTratamiento || tratamiento.estado || "Sin estado"}
                      size="small"
                      color={
                        (tratamiento.estadoTratamiento || tratamiento.estado || "").toUpperCase() ===
                        "EN PROCESO"
                          ? "info"
                          : (tratamiento.estadoTratamiento || tratamiento.estado || "").toUpperCase() ===
                            "FINALIZADO"
                          ? "success"
                          : (tratamiento.estadoTratamiento || tratamiento.estado || "").toUpperCase() ===
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
                      label={tratamiento.medicado ? "Sí" : "No"}
                      size="small"
                      color={tratamiento.medicado ? "info" : "default"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Información del Paciente */}
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
                    {tratamiento.paciente?.dpi || tratamiento.dpiPaciente || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.paciente
                      ? `${tratamiento.paciente.nombre || ""} ${tratamiento.paciente.apellido || ""}`.trim() ||
                        "-"
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.paciente?.telefono || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.paciente?.email || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    NIT
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.paciente?.nit || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Información del Psicólogo */}
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
                    {tratamiento.psicologo?.dpi ||
                      tratamiento.psicologoDpi ||
                      tratamiento.psicologo_dpi ||
                      "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.psicologo
                      ? `${tratamiento.psicologo.nombre || ""} ${tratamiento.psicologo.apellido || ""}`.trim() ||
                        "-"
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.psicologo?.telefono || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {tratamiento.psicologo?.email || "-"}
                  </Typography>
                </Grid>
                {tratamiento.psicologo?.rolEmpleado && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rol
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {tratamiento.psicologo.rolEmpleado.rol || "-"}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Sesiones Psicológicas */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sesiones Psicológicas ({sesiones.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loadingSesiones ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : sesiones.length > 0 ? (
                <Stack spacing={2}>
                  {sesiones.map((sesion: any, index: number) => (
                    <Paper key={index} elevation={1} sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            ID Sesión
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {sesion.id || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Fecha de Sesión
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {sesion.fechaSesion
                              ? new Date(sesion.fechaSesion).toLocaleDateString("es-GT")
                              : "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Observaciones
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {sesion.observaciones || "Sin observaciones"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No hay sesiones registradas para este tratamiento.
                </Typography>
              )}
            </Box>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No se pudo cargar la información del tratamiento.
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

