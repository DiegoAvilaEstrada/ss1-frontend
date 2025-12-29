import { useAlert } from "@components/Alerts";
import { TextInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { agregarSesion } from "@services/historial.service";
import { validateForm } from "@utilities/Functions";
import { useState } from "react";
import * as yup from "yup";

export default function ModalSesion({ open, onClose, refresh, setRefresh, historialData }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; historialData: any; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ fecha: string; duracion: number; notas: string; progreso: string; }>({ fecha: "", duracion: 60, notas: "", progreso: "" });
  const [errors, setErrors] = useState({ fecha: "", duracion: "", notas: "", progreso: "" });
  const validationSchema = yup.object({ fecha: yup.string().required("*La fecha es requerida"), duracion: yup.number().min(1, "La duración debe ser mayor a 0").required("*La duración es requerida"), notas: yup.string().required("*Las notas son requeridas"), progreso: yup.string().required("*El progreso es requerido"), });

  const handleChange = (e: any) => { const { name, value } = e; setForm({ ...form, [name]: name === "duracion" ? parseFloat(value) || 0 : value }); };

  const handleSave = () => { if (validateForm(validationSchema, form, setErrors)) { if (!historialData) return; agregarSesion(historialData.id, form).then(() => { AlertSuccess("Sesión agregada exitosamente"); setRefresh(refresh + 1); onClose(); setForm({ fecha: "", duracion: 60, notas: "", progreso: "" }); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"success.main"} color="white">Agregar Sesión</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextInput label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} errorForm={!!errors.fecha} helperTextForm={errors.fecha} validations={validationSchema} />
          <TextInput label="Duración (minutos)" name="duracion" type="number" value={form.duracion.toString()} onChange={handleChange} errorForm={!!errors.duracion} helperTextForm={errors.duracion} validations={validationSchema} />
          <TextInput label="Notas de la Sesión" name="notas" value={form.notas} onChange={handleChange} errorForm={!!errors.notas} helperTextForm={errors.notas} validations={validationSchema} maxCharacters={1000} multiline rows={4} />
          <TextInput label="Progreso" name="progreso" value={form.progreso} onChange={handleChange} errorForm={!!errors.progreso} helperTextForm={errors.progreso} validations={validationSchema} maxCharacters={500} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="success">Agregar Sesión</Button>
      </DialogActions>
    </Dialog>
  );
}

