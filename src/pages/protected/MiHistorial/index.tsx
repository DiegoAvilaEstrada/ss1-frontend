import { useAlert } from "@components/Alerts";
import { Psychology, Visibility, CalendarToday, Person, MedicalServices } from "@mui/icons-material";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Stack,
} from "@mui/material";
import { getAllTratamientos, getTratamientoById } from "@services/tratamiento.service";
import { getAllSesiones } from "@services/sesion.service";
import { getAllCuentasPacientes } from "@services/cuentaPaciente.service";
import { getPacienteDpi, getUserInfo } from "@utilities/Functions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MiHistorial = () => {
  const { AlertError } = useAlert();
  const navigate = useNavigate();
  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener DPI del paciente logueado
      const userInfo = getUserInfo();
      let dpiPaciente = null;

      // Intentar obtener el DPI desde las cuentas de pacientes
      try {
        const cuentasRes = await getAllCuentasPacientes();
        const cuentas = cuentasRes?.responseObject || cuentasRes || [];
        
        if (Array.isArray(cuentas)) {
          let cuentaEncontrada = null;
          
          // Buscar por username
          if (userInfo?.username) {
            cuentaEncontrada = cuentas.find((c: any) => c.username === userInfo.username);
          }
          
          // Si no se encontró, buscar por email
          if (!cuentaEncontrada && userInfo?.email) {
            cuentaEncontrada = cuentas.find((c: any) => 
              c.paciente?.email === userInfo.email || 
              c.username === userInfo.email.split("@")[0]
            );
          }
          
          if (cuentaEncontrada?.paciente?.dpi) {
            dpiPaciente = cuentaEncontrada.paciente.dpi;
          }
        }
      } catch (error) {
        console.error("Error obteniendo DPI desde cuenta paciente:", error);
      }

      // Si no se encontró, intentar desde otras fuentes
      if (!dpiPaciente) {
        dpiPaciente = getPacienteDpi() || userInfo?.dpi;
      }

      if (!dpiPaciente) {
        AlertError("No se pudo obtener el DPI del paciente. Por favor, verifica tu información de perfil.");
        setLoading(false);
        return;
      }

      const dpiString = String(dpiPaciente).trim();
      console.log("=== CARGANDO HISTORIAL CLÍNICO ===");
      console.log("DPI del paciente:", dpiString);

      // 2. Obtener todos los tratamientos
      const resTratamientos = await getAllTratamientos();
      const todosTratamientos = resTratamientos?.responseObject || resTratamientos || [];
      
      // 3. Filtrar tratamientos por DPI del paciente
      const tratamientosPaciente = Array.isArray(todosTratamientos)
        ? todosTratamientos.filter((t: any) => {
            const dpiTratamiento = t.paciente?.dpi || t.dpiPaciente || t.idPaciente;
            return String(dpiTratamiento) === dpiString;
          })
        : [];

      console.log("Tratamientos encontrados:", tratamientosPaciente.length);

      // 4. Para cada tratamiento, obtener los detalles completos
      const tratamientosCompletos = await Promise.all(
        tratamientosPaciente.map(async (tratamiento: any) => {
          try {
            const detalleRes = await getTratamientoById(tratamiento.id);
            const detalle = detalleRes?.responseObject || detalleRes || tratamiento;
            return detalle;
          } catch (error) {
            console.error(`Error obteniendo detalles del tratamiento ${tratamiento.id}:`, error);
            return tratamiento; // Retornar el tratamiento básico si falla
          }
        })
      );

      setTratamientos(tratamientosCompletos);

      // 5. Obtener todas las sesiones
      const resSesiones = await getAllSesiones();
      const todasSesiones = resSesiones?.responseObject || resSesiones || [];

      // 6. Filtrar sesiones por los tratamientos del paciente
      const idsTratamientos = tratamientosCompletos.map((t: any) => t.id);
      const sesionesPaciente = Array.isArray(todasSesiones)
        ? todasSesiones.filter((s: any) => {
            const idTrat = s.tratamiento?.id || s.idTratamiento;
            return idsTratamientos.includes(idTrat);
          })
        : [];

      // Ordenar sesiones por fecha (más reciente primero)
      sesionesPaciente.sort((a: any, b: any) => {
        const fechaA = new Date(a.fechaSesion || a.fecha_sesion || a.fecha || 0).getTime();
        const fechaB = new Date(b.fechaSesion || b.fecha_sesion || b.fecha || 0).getTime();
        return fechaB - fechaA;
      });

      setSesiones(sesionesPaciente);
      console.log("Sesiones encontradas:", sesionesPaciente.length);

    } catch (error: any) {
      console.error("Error cargando historial clínico:", error);
      AlertError("Error al cargar tu historial clínico");
    } finally {
      setLoading(false);
    }
  };

  const getSesionesPorTratamiento = (tratamientoId: number) => {
    return sesiones.filter((s: any) => {
      const idTrat = s.tratamiento?.id || s.idTratamiento;
      return idTrat === tratamientoId;
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={"bold"} gutterBottom>
        <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
        Mi Historial Clínico
      </Typography>
      <Divider sx={{ mt: 1, mb: 3 }} />

      {tratamientos.length > 0 ? (
        <Stack spacing={3}>
          {tratamientos.map((tratamiento: any, index: number) => {
            const sesionesTratamiento = getSesionesPorTratamiento(tratamiento.id);
            
            return (
              <Card key={tratamiento.id || index} elevation={3}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Tratamiento #{tratamiento.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Inicio: {tratamiento.fechaInicio
                          ? new Date(tratamiento.fechaInicio).toLocaleDateString("es-GT", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "-"}
                      </Typography>
                    </Box>
                    <Chip
                      label={tratamiento.estadoTratamiento || tratamiento.estado || "Sin estado"}
                      color={
                        (tratamiento.estadoTratamiento || tratamiento.estado || "").toUpperCase() === "EN PROCESO"
                          ? "info"
                          : (tratamiento.estadoTratamiento || tratamiento.estado || "").toUpperCase() === "FINALIZADO"
                          ? "success"
                          : (tratamiento.estadoTratamiento || tratamiento.estado || "").toUpperCase() === "CANCELADO"
                          ? "error"
                          : "default"
                      }
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    {/* Información del Psicólogo */}
                    {tratamiento.psicologo && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Person sx={{ mr: 1, color: "primary.main" }} />
                          <Typography variant="subtitle2" fontWeight="bold">
                            Psicólogo a Cargo
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {`${tratamiento.psicologo.nombre || ""} ${tratamiento.psicologo.apellido || ""}`.trim() || "-"}
                        </Typography>
                        {tratamiento.psicologo.email && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                            {tratamiento.psicologo.email}
                          </Typography>
                        )}
                      </Grid>
                    )}

                    {/* Información de Medicación */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <MedicalServices sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Requiere Medicación
                        </Typography>
                      </Box>
                      <Chip
                        label={tratamiento.medicado ? "Sí" : "No"}
                        size="small"
                        color={tratamiento.medicado ? "info" : "default"}
                      />
                    </Grid>
                  </Grid>

                  {/* Sesiones del Tratamiento */}
                  {sesionesTratamiento.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <CalendarToday sx={{ mr: 1, verticalAlign: "middle", fontSize: "1.2rem" }} />
                        Sesiones ({sesionesTratamiento.length})
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        {sesionesTratamiento.map((sesion: any, sesionIndex: number) => (
                          <Accordion key={sesion.id || sesionIndex}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {sesion.fechaSesion
                                    ? new Date(sesion.fechaSesion).toLocaleDateString("es-GT", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : "Sin fecha"}
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                                {sesion.observaciones || "Sin observaciones registradas"}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {sesionesTratamiento.length === 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No hay sesiones registradas para este tratamiento.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Psychology sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes tratamientos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tu historial clínico aparecerá aquí una vez que tengas tratamientos asignados.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MiHistorial;
