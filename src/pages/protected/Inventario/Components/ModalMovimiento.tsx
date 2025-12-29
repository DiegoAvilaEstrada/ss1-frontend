import { useAlert } from "@components/Alerts";
import { TextInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from "@mui/material";
import { registrarEntrada, registrarSalida } from "@services/inventario.service";
import { validateForm } from "@utilities/Functions";
import { useState } from "react";
import * as yup from "yup";

export default function ModalMovimiento({ open, onClose, refresh, setRefresh, itemData, tipo }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; itemData: any; tipo: "entrada" | "salida"; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ cantidad: number; motivo: string; }>({ cantidad: 0, motivo: "" });
  const [errors, setErrors] = useState({ cantidad: "", motivo: "" });
  const validationSchema = yup.object({ cantidad: yup.number().min(1, "La cantidad debe ser mayor a 0").required("*La cantidad es requerida"), motivo: yup.string().required("*El motivo es requerido"), });

  const handleChange = (e: any) => { const { name, value } = e; setForm({ ...form, [name]: name === "cantidad" ? parseFloat(value) || 0 : value }); };

  const handleSave = () => { if (validateForm(validationSchema, form, setErrors)) { const data = { itemId: itemData.id, cantidad: form.cantidad, motivo: form.motivo }; if (tipo === "entrada") { registrarEntrada(data).then(() => { AlertSuccess("Entrada registrada exitosamente"); setRefresh(refresh + 1); onClose(); setForm({ cantidad: 0, motivo: "" }); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } else { registrarSalida(data).then(() => { AlertSuccess("Salida registrada exitosamente"); setRefresh(refresh + 1); onClose(); setForm({ cantidad: 0, motivo: "" }); }).catch((error: any) => { AlertError(String(error?.response?.data?.message || "Ocurrió un error")); }); } } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={tipo === "entrada" ? "success.main" : "error.main"} color="white">{tipo === "entrada" ? "Registrar Entrada" : "Registrar Salida"}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>Item: {itemData?.name || "-"}</Typography>
        <Stack spacing={2} mt={1}>
          <TextInput label="Cantidad" name="cantidad" type="number" value={form.cantidad.toString()} onChange={handleChange} errorForm={!!errors.cantidad} helperTextForm={errors.cantidad} validations={validationSchema} />
          <TextInput label="Motivo" name="motivo" value={form.motivo} onChange={handleChange} errorForm={!!errors.motivo} helperTextForm={errors.motivo} validations={validationSchema} maxCharacters={500} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color={tipo === "entrada" ? "success" : "error"}>{tipo === "entrada" ? "Registrar Entrada" : "Registrar Salida"}</Button>
      </DialogActions>
    </Dialog>
  );
}

