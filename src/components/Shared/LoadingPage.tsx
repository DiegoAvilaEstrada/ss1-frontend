import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingPage = () => {
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
      <CircularProgress
        size={80}
        thickness={4}
        sx={{ color: "success.main" }}
      />

      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ mt: 3, color: "success.main" }}
      >
        Cargando...
      </Typography>

      <Typography
        variant="h6"
        sx={{ mt: 1, maxWidth: 400, color: "success.dark" }}
      >
        Por favor espera un momento
      </Typography>
    </Box>
  );
};

export default LoadingPage;
