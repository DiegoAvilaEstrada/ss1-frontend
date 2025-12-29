import { LoginRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Stack spacing={3} maxWidth={720}>
        <Typography
          variant="h3"
          fontWeight={800}
          color="primary"
        >
          PsiFirm
        </Typography>

        <Typography variant="h6" color="text.secondary">
          Plataforma integral para la gestión clínica, administrativa
          y financiera de firmas psicológicas.
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Centraliza pacientes, historiales clínicos, nómina,
          facturación e inventario en un solo sistema seguro.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginRounded />}
            sx={() => ({
              textTransform: "none",
              fontWeight: 900,
              borderRadius: 3,
              px: 2.4,
              py: 1.1,
            })}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Hero;
