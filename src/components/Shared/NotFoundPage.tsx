import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      <Typography
        variant="h1"
        fontWeight={800}
        color="primary.main"
        sx={{
          fontSize: { xs: "4rem", md: "8rem" },
          mb: 2,
          lineHeight: 1,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h4"
        color="text.primary"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        Página No Encontrada
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{
          textTransform: "none",
          fontWeight: 600,
          px: 4,
          py: 1.2,
          borderRadius: 2,
        }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFound;
