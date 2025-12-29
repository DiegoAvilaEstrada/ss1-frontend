import {
  Box,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

const publicaciones = [
  {
    id: 1,
    title: "Ansiedad: Señales y Estrategias",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Autocuidado Mental",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Mindfulness para el Estrés",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
  },
];

const Publicaciones = () => {
  return (
    <Box
      sx={(theme) => ({
        py: 10,
        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
      })}
    >
      <Stack spacing={6}>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            fontWeight={800}
            color="primary"
            sx={{ mb: 1 }}
          >
            Publicaciones de Salud Mental
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              bgcolor: "secondary.main",
              mx: "auto",
              borderRadius: 2,
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {publicaciones.map((publicacion) => (
            <Grid key={publicacion.id} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: 320,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                    "& .content-overlay": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                    "& img": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <Box
                  component="img"
                  src={publicacion.image}
                  alt={publicacion.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                />
                <Box
                  className="content-overlay"
                  sx={(theme) => ({
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.7)} 50%, transparent 100%)`,
                    p: 3,
                    opacity: 0.9,
                    transform: "translateY(10px)",
                    transition: "all 0.4s ease",
                  })}
                >
                  <Typography
                    variant="h6"
                    color="white"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                  >
                    {publicacion.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default Publicaciones;
