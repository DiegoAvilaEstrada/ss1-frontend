import {
  Box,
  Chip,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

const areas = [
  { label: "Psicología Clínica", icon: <PsychologyRoundedIcon fontSize="small" /> },
  { label: "Psiquiatría", icon: <LocalHospitalRoundedIcon fontSize="small" /> },
  { label: "Terapia Infantil", icon: <ChildCareRoundedIcon fontSize="small" /> },
  { label: "Neuropsicología", icon: <InsightsRoundedIcon fontSize="small" /> },
  { label: "Psicología Educativa", icon: <SchoolRoundedIcon fontSize="small" /> },
];

const Areas = () => {
  return (
    <Box
      sx={(theme) => ({
        py: { xs: 9, md: 12 },
        textAlign: "center",
        background: `linear-gradient(
          180deg,
          ${alpha(theme.palette.primary.main, 0.06)} 0%,
          ${alpha(theme.palette.secondary.main, 0.05)} 55%,
          transparent 100%
        )`,
      })}
    >
      <Stack spacing={5} alignItems="center">
        <Stack spacing={1.5} alignItems="center" sx={{ px: 2 }}>
          <Typography color="primary" variant="h4" fontWeight={900}>
            Áreas Clínicas y Especialidades
          </Typography>

          <Typography color="text.secondary" maxWidth={680}>
            PsiFirm soporta múltiples áreas clínicas, permitiendo la asignación
            de profesionales y la gestión de agendas por especialidad.
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          flexWrap="wrap"
          sx={{ gap: 1.5, px: 2, maxWidth: 900 }}
        >
          {areas.map((area) => (
            <Chip
              key={area.label}
              icon={area.icon}
              label={area.label}
              variant="outlined"
              sx={(theme) => ({
                px: 1.4,
                py: 2.4,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: "0.95rem",
                borderColor: alpha(theme.palette.primary.main, 0.25),
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                color: theme.palette.text.primary,
                backdropFilter: "blur(8px)",
                transition: "all .2s ease",
                "& .MuiChip-icon": {
                  color: theme.palette.primary.main,
                },
                "&:hover": {
                  borderColor: alpha(theme.palette.primary.main, 0.45),
                  bgcolor: alpha(theme.palette.primary.main, 0.07),
                  transform: "translateY(-2px)",
                  boxShadow: `0px 10px 26px ${alpha(
                    theme.palette.primary.main,
                    0.14
                  )}`,
                },
              })}
            />
          ))}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: 2, maxWidth: 760 }}
        >
          Cada área puede tener profesionales asignados, disponibilidad y agenda
          propia para organizar sesiones y atención especializada.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Areas;
