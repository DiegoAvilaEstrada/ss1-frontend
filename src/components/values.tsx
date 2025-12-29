import React from "react";
import { Box, Card, CardContent, Typography, alpha, Stack, Grid } from "@mui/material";
import {
  VerifiedUserRounded,
  GavelRounded,
  FavoriteRounded,
  ShieldRounded,
  PsychologyRounded,
  ReceiptLongRounded,
} from "@mui/icons-material";

type Value = {
  tag: string;
  title: string;
  description: string;
  Icon: React.ElementType;
};

const VALUES: Value[] = [
  {
    tag: "Confidencialidad",
    title: "Privacidad del paciente",
    description:
      "La información clínica es sensible: protegemos el acceso con roles y buenas prácticas de seguridad.",
    Icon: ShieldRounded,
  },
  {
    tag: "Ética",
    title: "Secreto profesional",
    description:
      "Respetamos la ética clínica, el consentimiento informado y el registro responsable de información.",
    Icon: GavelRounded,
  },
  {
    tag: "Humanidad",
    title: "Empatía y respeto",
    description:
      "Promovemos un trato digno, cálido y profesional en cada interacción con el paciente y su familia.",
    Icon: FavoriteRounded,
  },
  
];

const ValueCard = ({ tag, title, description, Icon }: Value) => {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        borderRadius: 4,
        height: "100%",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        boxShadow: "0px 14px 30px rgba(0,0,0,0.06)",
        transition: "all .22s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0px 18px 44px ${alpha(theme.palette.primary.main, 0.14)}`,
          borderColor: alpha(theme.palette.primary.main, 0.25),
        },
      })}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Box
          sx={(theme) => ({
            display: "inline-flex",
            px: 1.5,
            py: 0.55,
            borderRadius: 999,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.22)}`,
            bgcolor: alpha(theme.palette.secondary.main, 0.10),
            mb: 2,
          })}
        >
          <Typography
            variant="caption"
            sx={(theme) => ({
              fontWeight: 800,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              color: theme.palette.primary.main,
            })}
          >
            {tag}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2.2, alignItems: "flex-start" }}>
          <Box
            sx={(theme) => ({
              width: 44,
              height: 44,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              flexShrink: 0,
              transition: "all .22s ease",
            })}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.6 }}>
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.75 }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ValuesSection = () => {
  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        py: { xs: 9, md: 12 },
        px: 2,
        display: "flex",
        justifyContent: "center",
        background: `linear-gradient(180deg,
          transparent 0%,
          ${alpha(theme.palette.primary.main, 0.05)} 55%,
          transparent 100%)`,
      })}
    >
      <Box sx={{ width: "100%", maxWidth: 1100 }}>
        <Stack spacing={1.6} alignItems="center" sx={{ mb: 5 }}>
          <Box
            sx={(theme) => ({
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.10),
              display: "grid",
              placeItems: "center",
            })}
          >
            <ShieldRounded sx={{ fontSize: 34, color: "primary.main" }} />
          </Box>

          <Typography color="primary" variant="h4" sx={{ fontWeight: 900 }}>
            Nuestros valores
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 640, lineHeight: 1.75 }}
          >
            En PsiFirm priorizamos la confidencialidad, la ética y la calidad
            clínica, con una gestión segura y transparente.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {VALUES.map((val) => (
            <Grid key={val.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <ValueCard {...val} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ValuesSection;
