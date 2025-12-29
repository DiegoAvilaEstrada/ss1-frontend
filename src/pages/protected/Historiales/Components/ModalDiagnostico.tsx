import { useAlert } from "@components/Alerts";
import { TextInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { agregarDiagnostico } from "@services/historial.service";
import { validateForm } from "@utilities/Functions";
import { useState } from "react";
import * as yup from "yup";

export default function ModalDiagnostico({ open, onClose, refresh, setRefresh, historialData }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; historialData: any; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ diagnostico: string; codigo: string; observaciones: string; }>({ diagnostico: "", codigo: "", observaciones: "" });
  const [errors, setErrors] = useState({ diagnostico: "", codigo: "", observaciones: "" });
  const validationSchema = yup.object({ diagnostico: yup.string().required("*El diagnóstico es requerido"), codigo: yup.string().required("*El código es requerido"), observaciones: yup.string(), });

  const handleChange = (e: any) => { const { name, value } = e; setForm({ ...form, [name]: value }); };

  const handleSave = () => { if (validateForm(validationSchema, form, setErrors)) { if (!historialData) return; agregarDiagnostico(historialData.id, form).then(() => { AlertSuccess("Diagnóstico agregado exitosamente"); setRefresh(refresh + 1); onClose(); setForm({ diagnostico: "", codigo: "", observaciones: "" }); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"warning.main"} color="white">Agregar Diagnóstico</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextInput label="Diagnóstico" name="diagnostico" value={form.diagnostico} onChange={handleChange} errorForm={!!errors.diagnostico} helperTextForm={errors.diagnostico} validations={validationSchema} maxCharacters={500} />
          <TextInput label="Código (CIE-10)" name="codigo" value={form.codigo} onChange={handleChange} errorForm={!!errors.codigo} helperTextForm={errors.codigo} validations={validationSchema} maxCharacters={20} />
          <TextInput label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} errorForm={!!errors.observaciones} helperTextForm={errors.observaciones} validations={validationSchema} maxCharacters={1000} multiline rows={4} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="warning">Agregar Diagnóstico</Button>
      </DialogActions>
    </Dialog>
  );
}

