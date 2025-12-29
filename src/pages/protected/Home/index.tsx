import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { getCurrentName, getRole, getUserInfo, getPacienteDpi } from "@utilities/Functions";
import { getMenu } from "@utilities/Menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPacienteByDpi } from "@services/paciente.service";
import { getAllTratamientos } from "@services/tratamiento.service";
import { getAllSesiones } from "@services/sesion.service";
import { getEmpleadoByDpi, getAreaEmpleadoById } from "@services/empleado.service";
import { getMyInfo } from "@services/user.service";
import { getAllCuentasPacientes } from "@services/cuentaPaciente.service";
import { Person, Edit, Psychology, CalendarToday, Receipt, History, Settings } from "@mui/icons-material";
import SelectRoleModal from "./Components/SelectRoleModal";

const Home = () => {
  const navigate = useNavigate();
  const role = getRole();
  const items = getMenu(role || "");
  const userInfo = getUserInfo();
  const isPaciente = role === "CLIENTE";
  const isAdmin = role === "ADMIN"; // Solo ADMIN puede cambiar de rol
  
  const [modalRoleOpen, setModalRoleOpen] = useState(false);
  
  const [pacienteData, setPacienteData] = useState<any>(null);
  const [tratamientoActual, setTratamientoActual] = useState<any>(null);
  const [profesional, setProfesional] = useState<any>(null);
  const [proximaSesion, setProximaSesion] = useState<any>(null);
  const [ultimaSesion, setUltimaSesion] = useState<any>(null);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  
  // Datos del empleado logueado
  const [empleadoData, setEmpleadoData] = useState<any>(null);
  const [loadingEmpleado, setLoadingEmpleado] = useState(false);

  // Cargar datos del empleado logueado (si no es paciente)
  useEffect(() => {
    if (!isPaciente) {
      loadEmpleadoData();
    }
  }, [isPaciente]);

  // Cargar datos del paciente si es paciente
  useEffect(() => {
    if (isPaciente) {
      loadPacienteData();
    }
  }, [isPaciente]);

  const loadEmpleadoData = async () => {
    setLoadingEmpleado(true);
    try {
      // Obtener información del usuario para encontrar el ID del área-empleado
      const res = await getMyInfo();
      const userData = res?.data || res?.responseObject || res;
      
      // Buscar el ID del área-empleado en la respuesta
      const areaEmpleadoId = userData?.areaEmpleado?.id || 
                             userData?.empleado?.id || 
                             userData?.idEmpleado;

      if (areaEmpleadoId) {
        // Usar el endpoint /area-empleado/{id} para obtener los datos del empleado
        const areaRes = await getAreaEmpleadoById(Number(areaEmpleadoId));
        const empleado = areaRes?.responseObject || areaRes?.data || areaRes;
        
        if (empleado) {
          setEmpleadoData(empleado);
        }
      }
    } catch (error) {
      console.error("Error cargando datos del empleado:", error);
    } finally {
      setLoadingEmpleado(false);
    }
  };

  const loadPacienteData = async () => {
    setLoadingPaciente(true);
    try {
      // SIEMPRE intentar obtener los datos desde getAllCuentasPacientes primero
      let cuentaEncontrada = null;
      let dpi = null;
      let datosPaciente = null;
      
      try {
        console.log("=== CARGANDO DATOS DEL PACIENTE ===");
        console.log("UserInfo:", userInfo);
        
        const cuentasRes = await getAllCuentasPacientes();
        const cuentas = cuentasRes?.responseObject || cuentasRes || [];
        console.log("Cuentas obtenidas:", cuentas);
        
        if (Array.isArray(cuentas)) {
          // Buscar por username
          if (userInfo?.username) {
            cuentaEncontrada = cuentas.find((c: any) => c.username === userInfo.username);
            console.log("Buscando por username:", userInfo.username, "Encontrado:", cuentaEncontrada);
          }
          
          // Si no se encontró, buscar por email
          if (!cuentaEncontrada && userInfo?.email) {
            cuentaEncontrada = cuentas.find((c: any) => 
              c.paciente?.email === userInfo.email || 
              c.username === userInfo.email.split("@")[0]
            );
            console.log("Buscando por email:", userInfo.email, "Encontrado:", cuentaEncontrada);
          }
          
          // Si aún no se encontró, buscar por nombre
          if (!cuentaEncontrada && userInfo?.name) {
            const usernameFromName = userInfo.name.toLowerCase().replace(/\s+/g, ".");
            cuentaEncontrada = cuentas.find((c: any) => c.username === usernameFromName);
            console.log("Buscando por nombre:", usernameFromName, "Encontrado:", cuentaEncontrada);
          }
          
          // Si encontramos la cuenta, usar los datos del paciente directamente
          if (cuentaEncontrada?.paciente) {
            datosPaciente = cuentaEncontrada.paciente;
            dpi = cuentaEncontrada.paciente.dpi;
            console.log("✅ Datos del paciente obtenidos desde cuenta:", datosPaciente);
            setPacienteData(datosPaciente);
          }
        }
      } catch (error) {
        console.error("❌ Error obteniendo datos desde cuenta paciente:", error);
      }
      
      // Si no encontramos los datos desde cuentas, intentar con DPI
      if (!datosPaciente && !dpi) {
        dpi = getPacienteDpi() || userInfo?.dpi;
        console.log("DPI obtenido desde cookies/userInfo:", dpi);
      }
      
      if (dpi && !datosPaciente) {
        // Cargar datos del paciente (GET /paciente/{dpi}) si no los tenemos ya
        try {
          console.log("Intentando obtener paciente por DPI:", dpi);
          const resPaciente = await getPacienteByDpi(String(dpi));
          const paciente = resPaciente?.responseObject || resPaciente;
          if (paciente) {
            datosPaciente = paciente;
            console.log("✅ Datos del paciente obtenidos desde getPacienteByDpi:", datosPaciente);
            setPacienteData(datosPaciente);
          }
        } catch (error) {
          console.error("❌ Error obteniendo paciente por DPI:", error);
        }
      }
      
      // Si aún no tenemos datos, mostrar error
      if (!datosPaciente) {
        console.error("⚠️ No se pudieron obtener los datos del paciente");
      }
      
      // Continuar con el resto de la lógica solo si tenemos DPI
      if (dpi) {

        // 2) Cargar tratamientos y filtrar por paciente (GET /tratamiento/all)
        const resTratamientos = await getAllTratamientos();
        const tratamientos = resTratamientos?.responseObject || resTratamientos || [];
        const tratamientosPaciente = Array.isArray(tratamientos)
          ? tratamientos.filter((t: any) => {
              // Filtrar por id_paciente o dpi_paciente
              const idPaciente = t.idPaciente || t.dpiPaciente || t.paciente?.dpi || t.paciente?.idPaciente;
              return String(idPaciente) === String(dpi);
            })
          : [];
        
        // Obtener tratamiento activo (o el más reciente)
        const activo = tratamientosPaciente.find(
          (t: any) => {
            const estado = t.estadoTratamiento || t.estado || "";
            return estado.toUpperCase() === "ACTIVO";
          }
        ) || tratamientosPaciente[0];
        
        setTratamientoActual(activo);

        // 3) Si hay tratamiento activo, cargar profesional a cargo
        if (activo?.psicologoDpi || activo?.psicologo_dpi) {
          const dpiPsicologo = activo.psicologoDpi || activo.psicologo_dpi;
          try {
            const resEmpleado = await getEmpleadoByDpi(String(dpiPsicologo));
            const empleado = resEmpleado?.responseObject || resEmpleado;
            if (empleado) {
              setProfesional(empleado);
            }
          } catch (error) {
            console.error("Error cargando profesional:", error);
          }
        }

        // 4) Cargar sesiones y filtrar por tratamiento (GET /sesion_psicologica/all)
        if (activo?.id || activo?.idTratamiento) {
          const idTratamiento = activo.id || activo.idTratamiento;
          try {
            const resSesiones = await getAllSesiones();
            const sesiones = resSesiones?.responseObject || resSesiones || [];
            const sesionesTratamiento = Array.isArray(sesiones)
              ? sesiones.filter((s: any) => {
                  const idTrat = s.idTratamiento || s.tratamiento?.id || s.tratamiento?.idTratamiento;
                  return String(idTrat) === String(idTratamiento);
                })
              : [];

            // Ordenar sesiones por fecha
            sesionesTratamiento.sort((a: any, b: any) => {
              const fechaA = new Date(a.fechaSesion || a.fecha_sesion || a.fecha || 0).getTime();
              const fechaB = new Date(b.fechaSesion || b.fecha_sesion || b.fecha || 0).getTime();
              return fechaB - fechaA; // Más reciente primero
            });

            const ahora = new Date();
            const fechaAhora = ahora.getTime();

            // Última sesión: la más reciente pasada
            const ultima = sesionesTratamiento.find((s: any) => {
              const fecha = new Date(s.fechaSesion || s.fecha_sesion || s.fecha || 0).getTime();
              return fecha <= fechaAhora;
            });

            // Próxima sesión: la más próxima futura
            const proxima = sesionesTratamiento.find((s: any) => {
              const fecha = new Date(s.fechaSesion || s.fecha_sesion || s.fecha || 0).getTime();
              return fecha > fechaAhora;
            });

            setUltimaSesion(ultima || null);
            setProximaSesion(proxima || null);
          } catch (error) {
            console.error("Error cargando sesiones:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error cargando datos del paciente:", error);
    } finally {
      setLoadingPaciente(false);
    }
  };

  // Obtener nombre completo según el tipo de usuario
  const nombreCompleto = isPaciente && pacienteData
    ? `${pacienteData.nombre || ""} ${pacienteData.apellido || ""}`.trim() || getCurrentName()
    : empleadoData?.empleado?.nombre && empleadoData?.empleado?.apellido
    ? `${empleadoData.empleado.nombre} ${empleadoData.empleado.apellido}`.trim()
    : getCurrentName();

  // Obtener rol del empleado si existe
  const rolEmpleado = empleadoData?.empleado?.rolEmpleado?.rol || 
                      empleadoData?.rolEmpleado?.rol || 
                      empleadoData?.rol || 
                      role;

  // Vista especializada para pacientes
  if (isPaciente) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
        {/* Tarjeta de Bienvenida */}
        <Paper
          elevation={4}
          sx={(theme) => {
            const isDark = theme.palette.mode === "dark";
            return {
              p: 4,
              borderRadius: 3,
              mb: 4,
              color: isDark ? theme.palette.text.primary : theme.palette.background.paper,
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            };
          }}
        >
          <Typography variant="h4" fontWeight={700} textAlign="center">
          👋🏻 ¡Bienvenido, {nombreCompleto}!
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ mt: 1, opacity: 0.9 }}>
            {nombreCompleto || userInfo?.email || userInfo?.name || "-"}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Chip label="Paciente" color="secondary" sx={{ fontWeight: 600 }} />
          </Box>
        </Paper>

        {loadingPaciente ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Tarjeta: Mi Perfil */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                      Mi Perfil
                    </Typography>
                      <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => {
                        navigate("/home"); // Navegar a la página de perfil
                      }}
                    >
                      Editar
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nombre
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pacienteData?.nombre || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Apellido
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pacienteData?.apellido || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pacienteData?.email || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pacienteData?.telefono || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        DPI
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pacienteData?.dpi || "-"}
                      </Typography>
                    </Box>
                    {pacienteData?.nit && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          NIT
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {pacienteData.nit}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta: Resumen Clínico */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
                    Resumen Clínico
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tratamiento Actual
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {tratamientoActual?.estadoTratamiento || tratamientoActual?.estado || "No hay tratamiento activo"}
                      </Typography>
                      {tratamientoActual?.fechaInicio && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Desde: {new Date(tratamientoActual.fechaInicio).toLocaleDateString("es-GT")}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Profesional a Cargo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {tratamientoActual?.psicologo?.nombre && tratamientoActual?.psicologo?.apellido
                          ? `${tratamientoActual.psicologo.nombre} ${tratamientoActual.psicologo.apellido}`
                          : tratamientoActual?.psicologo?.nombre || 
                            tratamientoActual?.empleado?.nombre || 
                            profesional?.nombre && profesional?.apellido
                            ? `${profesional.nombre} ${profesional.apellido}`
                            : profesional?.nombre || 
                            "No asignado"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Próxima Sesión
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {proximaSesion?.fechaSesion
                          ? new Date(proximaSesion.fechaSesion).toLocaleDateString("es-GT", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Por programar"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Última Sesión
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {ultimaSesion?.fechaSesion
                          ? new Date(ultimaSesion.fechaSesion).toLocaleDateString("es-GT", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No disponible"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Accesos Rápidos */}
            <Grid size={{ xs: 12 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🔎 Accesos Rápidos
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        elevation={2}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "0.25s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => navigate("/mi-historial")}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <History sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Mi Historial
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Ver historial clínico completo
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        elevation={2}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "0.25s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => navigate("/mis-citas")}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <CalendarToday sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Mis Citas
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Gestionar mis citas
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        elevation={2}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "0.25s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => navigate("/mis-facturas")}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Receipt sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Mis Facturas
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Ver facturas y pagos
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        elevation={2}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "0.25s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => navigate("/home")} // TODO: Cambiar a ruta de perfil
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Person sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                          <Typography variant="h6" fontWeight={600}>
                            Mi Perfil
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Ver y editar mi perfil
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }

  // Vista estándar para otros roles
  return (
    <Box
      sx={{
        p: 3,
        minHeight: "80vh",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        sx={{
          height: { xs: 125, md: 175 },
          width: { xs: 125, md: 175 },
          mb: 3,
        }}
        alt="Logo de AMAS"
        src="/logo.png"
      />
      <Paper
        elevation={4}
        sx={(theme) => {
          const isDark = theme.palette.mode === "dark";

          return {
            p: 4,
            borderRadius: 3,
            mb: 4,
            width: "100%",
            maxWidth: 600,
            color: isDark
              ? theme.palette.text.primary
              : theme.palette.background.paper,
            background: `linear-gradient(
          135deg,
          ${theme.palette.primary.light} 0%,
          ${theme.palette.primary.main} 100%
        )`,
            transition: "background 0.3s ease, color 0.3s ease",
          };
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center">
        👋🏻 ¡Bienvenido, {nombreCompleto}!
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
          <Typography
            variant="h6"
            sx={{ opacity: 0.95 }}
          >
            Rol: <strong>{rolEmpleado}</strong>
          </Typography>
          {isAdmin && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings />}
              onClick={() => setModalRoleOpen(true)}
              sx={{ textTransform: "none" }}
            >
              Cambiar Rol
            </Button>
          )}
        </Box>

        <Typography
          variant="body1"
          sx={{ mt: 1, opacity: 0.9 }}
          textAlign="center"
        >
          Nos alegra verte de nuevo.
        </Typography>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, alignSelf: "flex-start" }}>
        🔎 Accesos rápidos
      </Typography>

      <Grid container spacing={3} justifyContent="flex-start" width={"100%"}>
        {items.length > 0 ? (
          items.map((item: any, index: any) => (
            <Grid size={{ xs: 12, md: 4, sm: 6 }} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  transition: "0.25s",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    {item.title}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(item.path)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.4,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    Ir
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            No hay accesos rápidos disponibles para tu rol.
          </Typography>
        )}
      </Grid>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "text.secondary", mt: 2  }}
      >
        © {new Date().getFullYear()} PsiFirm. Todos los derechos reservados.
      </Typography>
      
      {isAdmin && (
        <SelectRoleModal
          open={modalRoleOpen}
          onClose={() => setModalRoleOpen(false)}
          currentRole={role || "ADMIN"}
        />
      )}
    </Box>
  );
};

export default Home;