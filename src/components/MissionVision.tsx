import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  alpha,
  Grid,
} from "@mui/material";

import {
  GroupRounded,
  VisibilityRounded,
  PsychologyRounded,
  ShieldRounded,
  LocalHospitalRounded,
} from "@mui/icons-material";

const Pill = ({ label }: { label: string }) => {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        px: 2.2,
        py: 1.2,
        borderRadius: 999,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.9),
        boxShadow: "0px 8px 22px rgba(0,0,0,0.06)",
        typography: "body2",
        fontWeight: 600,
        gap: 1.2,
        transition: "all .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0px 12px 30px ${alpha(theme.palette.primary.main, 0.14)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        },
      })}
    >
      <Box
        sx={(theme) => ({
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: theme.palette.secondary.main, 
          boxShadow: `0 0 0 6px ${alpha(theme.palette.secondary.main, 0.18)}`,
          flexShrink: 0,
        })}
      />
      {label}
    </Box>
  );
};

const MissionVisionComponent = () => {
  return (
    <Box>
      <Box
        sx={(theme) => ({
          py: 10,
          px: 2,
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          background: `linear-gradient(180deg,
            ${alpha(theme.palette.primary.main, 0.06)} 0%,
            ${alpha(theme.palette.secondary.main, 0.05)} 60%,
            transparent 100%)`,
          borderRadius: 4,
        })}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          sx={{ maxWidth: 860 }}
        >
          <PsychologyRounded color="primary" sx={{ fontSize: 38, mb: 1 }} />

         

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 720, lineHeight: 1.8 }}
          >
            PsiFirm es una plataforma para clínicas y firmas psicológicas que
            centraliza la gestión clínica y administrativa: pacientes, historia
            clínica, nómina, facturación e inventario, con enfoque en seguridad y
            confidencialidad.
          </Typography>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mt: 3, alignItems: "stretch" }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={(theme) => ({
              borderRadius: 4,
              width: "100%",
              boxShadow: "0px 18px 44px rgba(0,0,0,0.08)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.10)}`,
              overflow: "hidden",
            })}
          >
            <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                <LocalHospitalRounded color="primary" sx={{ fontSize: 34 }} />

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    Nuestra Misión
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.9,
                      mt: 0.5,
                      mb: 3,
                      maxWidth: 660,
                    }}
                  >
                    Brindar una solución integral para la gestión de clínicas
                    psicológicas, facilitando el control seguro de información
                    clínica, la administración del personal, la facturación y el
                    inventario, mejorando la calidad del servicio y la toma de
                    decisiones.
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Pill label="Gestión de pacientes y expedientes" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Pill label="Historia clínica estructurada" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Pill label="Agenda y control de sesiones" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Pill label="Facturación y pagos por servicio" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Pill label="Nómina: bonos, retenciones, IGSS" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Pill label="Inventario: stock mínimo y alertas" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <Stack spacing={3} sx={{ height: "100%", width: "100%" }}>
            <Card
              elevation={0}
              sx={(theme) => ({
                borderRadius: 4,
                boxShadow: "0px 16px 32px rgba(0,0,0,0.06)",
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.18)}`,
                flex: 1,
              })}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <VisibilityRounded sx={{ fontSize: 28 }} color="primary" />

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Nuestra Visión
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.75, mt: 1.1, mb: 2 }}
                    >
                      Ser una plataforma confiable y moderna para clínicas de
                      salud mental, elevando el estándar de gestión y atención
                      mediante procesos seguros, ordenados y centrados en el
                      paciente.
                    </Typography>


                  
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={(theme) => ({
                borderRadius: 4,
                boxShadow: "0px 14px 28px rgba(0,0,0,0.05)",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              })}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <ShieldRounded sx={{ fontSize: 28 }} color="primary" />

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Confidencialidad
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, mt: 0.7 }}
                    >
                      Protección de datos sensibles, control por roles y auditoría
                      de accesos para asegurar el cumplimiento del secreto
                      profesional.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <GroupRounded sx={{ fontSize: 28 }} color="primary" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Equipo y Roles
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Perfiles: Paciente, Psicólogo/Psiquiatra, Técnico,
                      Administrativo, Mantenimiento y Administrador.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MissionVisionComponent;
