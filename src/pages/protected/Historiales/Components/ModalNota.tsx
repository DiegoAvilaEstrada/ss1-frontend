import { useAlert } from "@components/Alerts";
import { TextInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { agregarNota } from "@services/historial.service";
import { validateForm } from "@utilities/Functions";
import { useState } from "react";
import * as yup from "yup";

export default function ModalNota({ open, onClose, refresh, setRefresh, historialData }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; historialData: any; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ titulo: string; contenido: string; confidencial: boolean; }>({ titulo: "", contenido: "", confidencial: false });
  const [errors, setErrors] = useState({ titulo: "", contenido: "", confidencial: "" });
  const validationSchema = yup.object({ titulo: yup.string().required("*El título es requerido"), contenido: yup.string().required("*El contenido es requerido"), confidencial: yup.boolean(), });

  const handleChange = (e: any) => { const { name, value, checked } = e; setForm({ ...form, [name]: name === "confidencial" ? checked : value }); };

  const handleSave = () => { if (validateForm(validationSchema, form, setErrors)) { if (!historialData) return; agregarNota(historialData.id, form).then(() => { AlertSuccess("Nota agregada exitosamente"); setRefresh(refresh + 1); onClose(); setForm({ titulo: "", contenido: "", confidencial: false }); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">Agregar Nota</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextInput label="Título" name="titulo" value={form.titulo} onChange={handleChange} errorForm={!!errors.titulo} helperTextForm={errors.titulo} validations={validationSchema} maxCharacters={200} />
          <TextInput label="Contenido" name="contenido" value={form.contenido} onChange={handleChange} errorForm={!!errors.contenido} helperTextForm={errors.contenido} validations={validationSchema} maxCharacters={2000} multiline rows={6} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="info">Agregar Nota</Button>
      </DialogActions>
    </Dialog>
  );
}

