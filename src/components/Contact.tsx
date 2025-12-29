import React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  alpha,
  Grid,
} from "@mui/material";
import {
  CalendarMonthRounded,
  EmailRounded,
  LocationOnRounded,
  MailOutlineRounded,
  PhoneRounded,
} from "@mui/icons-material";

const IconBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={(theme) => ({
        width: 42,
        height: 42,
        borderRadius: 2.5,
        display: "grid",
        placeItems: "center",
        bgcolor: alpha(theme.palette.primary.main, 0.10),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        color: theme.palette.primary.main,
        flex: "0 0 auto",
        boxShadow: "0 10px 22px rgba(2, 6, 23, 0.08)",
      })}
    >
      {children}
    </Box>
  );
};

const InfoRow = ({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) => {
  return (
    <Stack direction="row" spacing={1.6} alignItems="flex-start">
      <IconBadge>{icon}</IconBadge>

      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: 13 }}>{title}</Typography>

        {lines.map((text, i) => (
          <Typography
            color="text.secondary"
            key={i}
            sx={{ fontSize: 12.8, mt: 0.35, lineHeight: 1.65 }}
          >
            {text}
          </Typography>
        ))}
      </Box>
    </Stack>
  );
};

const ContactSection = () => {
  const email = "contacto@psifirm.com";
  const phone = "+502 11223344";
  const addressLines = ["Quetzaltenango, Guatemala", "Atención con cita previa"];

  return (
    <Box sx={{ py: { xs: 8, md: 11 } }}>
      <Container maxWidth="md">
        <Stack alignItems="center" spacing={1.3} sx={{ mb: 4, textAlign: "center" }}>
          <Box
            sx={(theme) => ({
              width: 56,
              height: 56,
              borderRadius: 3.2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.10),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
              color: theme.palette.primary.main,
              boxShadow: "0 16px 32px rgba(2, 6, 23, 0.10)",
            })}
          >
            <MailOutlineRounded />
          </Box>

          <Typography
          color="primary"
            sx={{
              fontWeight: 50,
              fontSize: { xs: 28, md: 40 },
              letterSpacing: -0.6,
              lineHeight: 1.1,
            }}
          >
            Contáctanos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ fontSize: 14, maxWidth: 600, lineHeight: 1.7 }}
          >
            Agenda una cita o comunícate con nosotros para información sobre servicios,
            disponibilidad y soporte de la plataforma.
          </Typography>
        </Stack>

        <Card
          elevation={0}
          sx={(theme) => ({
            borderRadius: 4,
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: "0 14px 34px rgba(2, 6, 23, 0.10)",
          })}
        >
          <Box sx={{ py: 1.8, px: 2.6 }}>
            <Typography sx={{ fontWeight: 950, textAlign: "center" }}>
              Datos de la clínica
            </Typography>
          </Box>

          <Box sx={{ px: 2.8 }}>
            <Divider />
          </Box>

          <CardContent sx={{ p: { xs: 2.4, md: 3.4 } }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.4}>
                  <InfoRow
                    icon={<LocationOnRounded fontSize="small" />}
                    title="Dirección"
                    lines={addressLines}
                  />

                  <InfoRow
                    icon={<PhoneRounded fontSize="small" />}
                    title="Teléfono"
                    lines={[phone]}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.4}>
                  <InfoRow
                    icon={<EmailRounded fontSize="small" />}
                    title="Correo electrónico"
                    lines={[email]}
                  />

                  <InfoRow
                    icon={<CalendarMonthRounded fontSize="small" />}
                    title="Horario"
                    lines={["Lunes a Viernes: 8:00 - 17:00", "Sábado: 8:00 - 12:00"]}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ContactSection;
