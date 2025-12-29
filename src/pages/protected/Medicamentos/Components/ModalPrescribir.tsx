import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { prescribirMedicamento } from "@services/medicamento.service";
import { getAllPacientes } from "@services/paciente.service";
import { getAllInventario } from "@services/inventario.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalPrescribir({ open, onClose, refresh, setRefresh }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ pacienteId: { id: number; name: string } | null; medicamentoId: { id: number; name: string } | null; dosis: string; frecuencia: string; duracion: number; instrucciones: string; }>({ pacienteId: null, medicamentoId: null, dosis: "", frecuencia: "", duracion: 0, instrucciones: "" });
  const [errors, setErrors] = useState({ pacienteId: "", medicamentoId: "", dosis: "", frecuencia: "", duracion: "", instrucciones: "" });
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const validationSchema = yup.object({ pacienteId: yup.object().required("*El paciente es requerido"), medicamentoId: yup.object().required("*El medicamento es requerido"), dosis: yup.string().required("*La dosis es requerida"), frecuencia: yup.string().required("*La frecuencia es requerida"), duracion: yup.number().min(1, "La duración debe ser mayor a 0").required("*La duración es requerida"), instrucciones: yup.string().required("*Las instrucciones son requeridas"), });

  useEffect(() => { getAllPacientes({ page: 1, size: 100 }).then((res: any) => { if (res?.data) { setPacientes(Array.isArray(res.data) ? res.data : res.data.data || []); } }).catch(() => {}); getAllInventario({ page: 1, size: 100 }).then((res: any) => { if (res?.data) { setMedicamentos(Array.isArray(res.data) ? res.data : res.data.data || []); } }).catch(() => {}); }, []);

  const handleChange = (e: any) => { const { name, value } = e; setForm({ ...form, [name]: name === "duracion" ? parseFloat(value) || 0 : value }); };

  const handleSave = () => { if (validateForm(validationSchema, form, setErrors)) { const params = { pacienteId: form.pacienteId?.id, medicamentoId: form.medicamentoId?.id, dosis: form.dosis, frecuencia: form.frecuencia, duracion: form.duracion, instrucciones: form.instrucciones, }; prescribirMedicamento(params).then(() => { AlertSuccess("Medicamento prescrito exitosamente"); setRefresh(refresh + 1); onClose(); setForm({ pacienteId: null, medicamentoId: null, dosis: "", frecuencia: "", duracion: 0, instrucciones: "" }); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">Prescribir Medicamento</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <SelectSimplyInput options={pacientes.map(p => ({ id: p.id, name: `${p.name} ${p.lastName || ""}` }))} label="Paciente" name="pacienteId" valueOptions="id" labelOptions="name" onChange={handleChange} value={form.pacienteId} errorForm={!!errors.pacienteId} helperTextForm={errors.pacienteId} validations={validationSchema} variant="outlined" />
          <SelectSimplyInput options={medicamentos.map(m => ({ id: m.id, name: m.name }))} label="Medicamento" name="medicamentoId" valueOptions="id" labelOptions="name" onChange={handleChange} value={form.medicamentoId} errorForm={!!errors.medicamentoId} helperTextForm={errors.medicamentoId} validations={validationSchema} variant="outlined" />
          <TextInput label="Dosis" name="dosis" value={form.dosis} onChange={handleChange} errorForm={!!errors.dosis} helperTextForm={errors.dosis} validations={validationSchema} maxCharacters={100} />
          <TextInput label="Frecuencia" name="frecuencia" value={form.frecuencia} onChange={handleChange} errorForm={!!errors.frecuencia} helperTextForm={errors.frecuencia} validations={validationSchema} maxCharacters={100} />
          <TextInput label="Duración (días)" name="duracion" type="number" value={form.duracion.toString()} onChange={handleChange} errorForm={!!errors.duracion} helperTextForm={errors.duracion} validations={validationSchema} />
          <TextInput label="Instrucciones" name="instrucciones" value={form.instrucciones} onChange={handleChange} errorForm={!!errors.instrucciones} helperTextForm={errors.instrucciones} validations={validationSchema} maxCharacters={500} multiline rows={3} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="info">Prescribir</Button>
      </DialogActions>
    </Dialog>
  );
}

