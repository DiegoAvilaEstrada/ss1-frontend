import {
  EmailOutlined,
  RoomOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Paper,
  Link,
  alpha,
  Grid,
} from "@mui/material";
import type { MarginProps } from "@utilities/types/MarginProps";

const Footer = ({ margin }: { margin: MarginProps }) => {

  const clinicEmail = "contacto@psifirm.com";
  const clinicCity = "Quetzaltenango, Guatemala";

  return (
    <Box
      component="footer"
      sx={(theme) => {
        const p = theme.palette.primary.main; 
        const s = theme.palette.secondary.main; 

        return {
          mt: 10,
          px: margin,
          color: theme.palette.common.white,
          position: "relative",
          overflow: "hidden",
          backgroundColor: p,
          backgroundImage: `
            radial-gradient(1200px 600px at 16% 0%,
              ${alpha(s, 0.26)} 0%,
              transparent 60%),
            radial-gradient(900px 520px at 92% 18%,
              ${alpha(theme.palette.common.white, 0.10)} 0%,
              transparent 55%),
            linear-gradient(180deg,
              ${alpha(p, 0.98)} 0%,
              ${alpha(p, 0.92)} 55%,
              ${alpha(p, 0.86)} 100%)
          `,
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.16)}`,
        };
      }}
    >
      <Box sx={{ py: { xs: 5, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Paper
                  elevation={0}
                  sx={(theme) => ({
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
                    bgcolor: alpha(theme.palette.common.white, 0.06),
                    boxShadow: `0 12px 36px ${alpha("#000", 0.22)}`,
                  })}
                >
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="PsiFirm"
                    loading="lazy"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Paper>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 950, letterSpacing: 0.2, lineHeight: 1.1 }}
                  >
                    PsiFirm
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.3 }}>
                    Gestión clínica segura y humana
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 520 }}>
                Plataforma integral para clínicas de salud mental: pacientes, historia clínica,
                nómina, facturación e inventario con control por roles y auditoría.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
            <Typography sx={{ fontWeight: 950, letterSpacing: 0.2, mb: 2.5 }}>
              Contacto
            </Typography>
            <Stack spacing={1.5}>
              <Paper
                elevation={0}
                sx={(theme) => ({
                  p: 1.8,
                  borderRadius: 2.6,
                  border: `1px solid ${alpha(theme.palette.common.white, 0.14)}`,
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                })}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <RoomOutlined sx={{ opacity: 0.9 }} fontSize="small" />
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    {clinicCity}
                  </Typography>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={(theme) => ({
                  p: 1.8,
                  borderRadius: 2.6,
                  border: `1px solid ${alpha(theme.palette.common.white, 0.14)}`,
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                })}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailOutlined sx={{ opacity: 0.9 }} fontSize="small" />
                  <Link
                    href={`mailto:${clinicEmail}`}
                    underline="none"
                    sx={(theme) => ({
                      color: theme.palette.common.white,
                      opacity: 0.95,
                      fontSize: theme.typography.body2.fontSize,
                      "&:hover": { textDecoration: "underline", opacity: 1 },
                    })}
                  >
                    {clinicEmail}
                  </Link>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={(theme) => ({ borderColor: alpha(theme.palette.common.white, 0.18) })} />

      <Box
        sx={{
          py: 2.3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1.2, md: 2 },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.82 }}>
          © {new Date().getFullYear()} PsiFirm. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
