import { useAlert } from "@components/Alerts";
import { Assessment, GetApp } from "@mui/icons-material";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import { getReporteFinanciero, getReporteInventario, getReporteClinico, getReporteRecursosHumanos } from "@services/reporte.service";
import { useState } from "react";

const Reportes = () => {
  const { AlertError } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [periodo, setPeriodo] = useState<string>("");

  const handleGenerarReporte = async (tipo: string) => {
    setLoading(true);
    try {
      let res: any;
      switch (tipo) {
        case "financiero":
          if (!fechaInicio || !fechaFin) {
            AlertError("Debe ingresar fecha de inicio y fin");
            setLoading(false);
            return;
          }
          res = await getReporteFinanciero({ fechaInicio, fechaFin });
          break;
        case "inventario":
          res = await getReporteInventario({});
          break;
        case "clinico":
          if (!fechaInicio || !fechaFin) {
            AlertError("Debe ingresar fecha de inicio y fin");
            setLoading(false);
            return;
          }
          res = await getReporteClinico({ fechaInicio, fechaFin });
          break;
        case "recursos-humanos":
          if (!periodo) {
            AlertError("Debe ingresar un período");
            setLoading(false);
            return;
          }
          res = await getReporteRecursosHumanos({ periodo });
          break;
      }
      // Aquí podrías descargar o mostrar el reporte
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      AlertError(String(error?.response?.data?.message || "Error al generar reporte"));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={"bold"} gutterBottom>
        Reportes Generales
      </Typography>
      <Divider sx={{ mt: 1, mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reporte Financiero
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField label="Fecha Inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              <TextField label="Fecha Fin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              <Button variant="contained" color="primary" onClick={() => handleGenerarReporte("financiero")} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}>
                Generar Reporte Financiero
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reporte de Inventario
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => handleGenerarReporte("inventario")} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <Assessment />} fullWidth>
                Generar Reporte de Inventario
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reporte Clínico
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField label="Fecha Inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              <TextField label="Fecha Fin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              <Button variant="contained" color="primary" onClick={() => handleGenerarReporte("clinico")} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}>
                Generar Reporte Clínico
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reporte de Recursos Humanos
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField label="Período (YYYY-MM)" value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="2025-01" fullWidth />
              <Button variant="contained" color="primary" onClick={() => handleGenerarReporte("recursos-humanos")} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}>
                Generar Reporte de RRHH
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reportes;
