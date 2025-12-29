import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Grid } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

const services = [
  {
    title: "Gestión de Pacientes",
    description:
      "Registro completo de pacientes, datos personales y seguimiento clínico.",
    icon: <PeopleAltRoundedIcon />,
  },
  {
    title: "Historial Clínico Digital",
    description:
      "Historias clínicas estructuradas, diagnósticos, sesiones y notas.",
    icon: <DescriptionRoundedIcon />,
  },
  {
    title: "Nómina de Empleados",
    description:
      "Cálculo de salarios, pagos por sesión, bonos y retenciones.",
    icon: <PaymentsRoundedIcon />,
  },
  {
    title: "Facturación y Pagos",
    description:
      "Registro de pagos, emisión de facturas y control de cuentas por cobrar.",
    icon: <ReceiptLongRoundedIcon />,
  },
  {
    title: "Inventario Terapéutico",
    description:
      "Control de medicamentos, herramientas terapéuticas y alertas de stock.",
    icon: <Inventory2RoundedIcon />,
  },
];

const Services = () => {
  return (
    <Box
      sx={(theme) => ({
        py: 12,
        background: `linear-gradient(
          180deg,
          ${alpha(theme.palette.primary.light, 0.06)} 0%,
          transparent 100%
        )`,
      })}
    >
      <Stack spacing={7}>
        <Stack spacing={1.5} alignItems="center">
          <Typography color="primary" variant="h4" fontWeight={800}>
            Servicios Principales
          </Typography>
          <Typography color="text.secondary" maxWidth={520} textAlign="center">
            PsiFirm centraliza los procesos clínicos y administrativos
            para una gestión profesional y segura.
          </Typography>
        </Stack>

        <Grid container spacing={4} justifyContent="center">
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={(theme) => ({
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                  transition: "all .25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 32px rgba(0,0,0,0.10)",
                  },
                })}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={(theme) => ({
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.main,
                      })}
                    >
                      {service.icon}
                    </Box>

                    <Typography fontWeight={700}>
                      {service.title}
                    </Typography>

                    <Typography color="text.secondary" fontSize="0.95rem">
                      {service.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default Services;
