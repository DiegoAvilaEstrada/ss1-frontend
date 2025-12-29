import { useAlert } from "@components/Alerts";
import { TextInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Stack,
  TextField,
} from "@mui/material";
import { getPacienteByDpi, updatePaciente } from "@services/paciente.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { Person, Edit, Save, Cancel } from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`paciente-tabpanel-${index}`}
      aria-labelledby={`paciente-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ModalPerfilPaciente({
  open,
  onClose,
  pacienteDpi,
  onUpdateSuccess,
}: {
  open: boolean;
  onClose: () => void;
  pacienteDpi: string | null;
  onUpdateSuccess?: () => void;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [paciente, setPaciente] = useState<any>(null);
  const [form, setForm] = useState<{
    dpi: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    nit: string;
  }>({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    nit: "",
  });

  const [errors, setErrors] = useState({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    nit: "",
  });

  const validationSchema = yup.object({
    dpi: yup.string().required("*El DPI es requerido"),
    nombre: yup.string().required("*El nombre es requerido"),
    apellido: yup.string().required("*El apellido es requerido"),
    telefono: yup.string().required("*El teléfono es requerido"),
    email: yup.string().email("Email inválido").required("*El email es requerido"),
    nit: yup.string().required("*El NIT es requerido"),
  });

  // Cargar datos del paciente
  useEffect(() => {
    if (open && pacienteDpi) {
      setLoading(true);
      getPacienteByDpi(pacienteDpi)
        .then((res: any) => {
          console.log("Datos del paciente:", res);
          if (res?.responseObject) {
            const pacienteData = res.responseObject;
            setPaciente(pacienteData);
            setForm({
              dpi: pacienteData.dpi || "",
              nombre: pacienteData.nombre || "",
              apellido: pacienteData.apellido || "",
              telefono: pacienteData.telefono || "",
              email: pacienteData.email || "",
              nit: pacienteData.nit || "",
            });
          } else if (res) {
            setPaciente(res);
            setForm({
              dpi: res.dpi || "",
              nombre: res.nombre || "",
              apellido: res.apellido || "",
              telefono: res.telefono || "",
              email: res.email || "",
              nit: res.nit || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error cargando paciente:", error);
          AlertError("Error al cargar la información del paciente");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPaciente(null);
      setEditMode(false);
    }
  }, [open, pacienteDpi, AlertError]);

  const handleChange = (event: { value: string; name: string }) => {
    const { value, name } = event;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      setLoading(true);
      updatePaciente(form)
        .then((res: any) => {
          console.log("Paciente actualizado:", res);
          AlertSuccess("Paciente actualizado exitosamente");
          setEditMode(false);
          if (onUpdateSuccess) {
            onUpdateSuccess();
          }
          // Recargar datos
          if (pacienteDpi) {
            getPacienteByDpi(pacienteDpi)
              .then((res: any) => {
                if (res?.responseObject) {
                  setPaciente(res.responseObject);
                } else if (res) {
                  setPaciente(res);
                }
              })
              .catch(() => {});
          }
        })
        .catch((error: any) => {
          console.error("Error actualizando paciente:", error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocurrió un error al actualizar el paciente";
          AlertError(errorMsg);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    if (paciente) {
      setForm({
        dpi: paciente.dpi || "",
        nombre: paciente.nombre || "",
        apellido: paciente.apellido || "",
        telefono: paciente.telefono || "",
        email: paciente.email || "",
        nit: paciente.nit || "",
      });
    }
    setEditMode(false);
    setErrors({
      dpi: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      nit: "",
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!paciente && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        bgcolor={"primary.main"}
        color="white"
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person />
          <Typography variant="h6">
            Perfil del Paciente: {paciente?.nombre} {paciente?.apellido}
          </Typography>
        </Box>
        {!editMode && (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<Edit />}
            onClick={() => setEditMode(true)}
          >
            Editar
          </Button>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs de paciente">
            <Tab label="Información Personal" />
            <Tab label="Funcionalidades" />
          </Tabs>
        </Box>

        {/* Tab: Información Personal */}
        <TabPanel value={tabValue} index={0}>
          {loading && !paciente ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <Typography>Cargando...</Typography>
            </Box>
          ) : editMode ? (
            <Stack spacing={2}>
              <Typography variant="h6" gutterBottom>
                Editar Información
              </Typography>
              <TextField
                label="DPI"
                name="dpi"
                fullWidth
                value={form.dpi}
                onChange={(e) => handleChange({ name: "dpi", value: e.target.value })}
                error={!!errors.dpi}
                helperText={errors.dpi}
                variant="outlined"
                disabled={true}
                inputProps={{
                  maxLength: 20,
                }}
              />
              <TextInput
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                errorForm={!!errors.nombre}
                helperTextForm={errors.nombre}
                validations={validationSchema}
                maxCharacters={100}
              />
              <TextInput
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                errorForm={!!errors.apellido}
                helperTextForm={errors.apellido}
                validations={validationSchema}
                maxCharacters={100}
              />
              <TextInput
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                errorForm={!!errors.telefono}
                helperTextForm={errors.telefono}
                validations={validationSchema}
                maxCharacters={30}
              />
              <TextInput
                label="Email"
                name="email"
                maxCharacters={255}
                value={form.email}
                onChange={handleChange}
                errorForm={!!errors.email}
                helperTextForm={errors.email}
                validations={validationSchema}
              />
              <TextInput
                label="NIT"
                name="nit"
                value={form.nit}
                onChange={handleChange}
                errorForm={!!errors.nit}
                helperTextForm={errors.nit}
                validations={validationSchema}
                maxCharacters={20}
              />
            </Stack>
          ) : (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Información Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    DPI
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {paciente?.dpi || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    NIT
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {paciente?.nit || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {paciente?.nombre || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Apellido
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {paciente?.apellido || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{paciente?.email || "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">{paciente?.telefono || "-"}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </TabPanel>

        {/* Tab: Funcionalidades */}
        <TabPanel value={tabValue} index={1}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Funcionalidades del Paciente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  📋 Ver Historial Clínico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El paciente puede acceder a su historial clínico completo, incluyendo:
                  diagnósticos, tratamientos, sesiones de terapia, y notas médicas.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  📅 Gestionar Citas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El paciente puede ver sus citas programadas, solicitar nuevas citas y
                  cancelar o reprogramar citas existentes.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  💰 Ver Facturas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El paciente puede consultar sus facturas, ver el estado de pagos y
                  descargar comprobantes.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  💊 Ver Medicamentos Prescritos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El paciente puede ver los medicamentos que le han sido prescritos,
                  dosis, frecuencia y fechas de inicio/fin.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {editMode ? (
          <>
            <Button
              onClick={handleCancelEdit}
              color="error"
              variant="outlined"
              startIcon={<Cancel />}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="success"
              startIcon={<Save />}
              disabled={loading}
            >
              Guardar Cambios
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="contained" color="primary">
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

