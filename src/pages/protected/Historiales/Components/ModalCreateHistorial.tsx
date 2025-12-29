import { useAlert } from "@components/Alerts";
import { SelectSimplyInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { createHistorial } from "@services/historial.service";
import { getAllPacientes } from "@services/paciente.service";
import { getAllEmpleados } from "@services/empleado.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateHistorial({ open, onClose, refresh, setRefresh, pacienteId }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; pacienteId: number | null; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ pacienteId: { id: number; name: string } | null; profesionalId: { id: number; name: string } | null; }>({ pacienteId: null, profesionalId: null });
  const [errors, setErrors] = useState({ pacienteId: "", profesionalId: "" });
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const validationSchema = yup.object({ pacienteId: yup.object().required("*El paciente es requerido"), profesionalId: yup.object().required("*El profesional es requerido"), });

  useEffect(() => { getAllPacientes({ page: 1, size: 100 }).then((res: any) => { if (res?.data) { const data = Array.isArray(res.data) ? res.data : res.data.data || []; setPacientes(data); if (pacienteId) { const paciente = data.find((p: any) => p.id === pacienteId); if (paciente) setForm({ ...form, pacienteId: { id: paciente.id, name: `${paciente.name} ${paciente.lastName || ""}` } }); } } }).catch(() => {}); getAllEmpleados({ page: 1, size: 100 }).then((res: any) => { if (res?.data) { setProfesionales(Array.isArray(res.data) ? res.data : res.data.data || []); } }).catch(() => {}); }, [pacienteId]);

  const handleChange = (e: any) => { const { name, value } = e; setForm({ ...form, [name]: value }); };

  const handleSave = () => { if (validateForm(validationSchema, form, setErrors)) { const params = { pacienteId: form.pacienteId?.id, profesionalId: form.profesionalId?.id }; createHistorial(params).then(() => { AlertSuccess("Historial creado exitosamente"); setRefresh(refresh + 1); onClose(); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">Crear Historial Clínico</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <SelectSimplyInput options={pacientes.map(p => ({ id: p.id, name: `${p.name} ${p.lastName || ""}` }))} label="Paciente" name="pacienteId" valueOptions="id" labelOptions="name" onChange={handleChange} value={form.pacienteId} errorForm={!!errors.pacienteId} helperTextForm={errors.pacienteId} validations={validationSchema} variant="outlined" />
          <SelectSimplyInput options={profesionales.map(p => ({ id: p.id, name: `${p.name} ${p.lastName || ""}` }))} label="Profesional" name="profesionalId" valueOptions="id" labelOptions="name" onChange={handleChange} value={form.profesionalId} errorForm={!!errors.profesionalId} helperTextForm={errors.profesionalId} validations={validationSchema} variant="outlined" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="info">Crear</Button>
      </DialogActions>
    </Dialog>
  );
}

