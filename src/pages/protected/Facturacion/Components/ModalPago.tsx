import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from "@mui/material";
import { registrarPago } from "@services/facturacion.service";
import { validateForm } from "@utilities/Functions";
import { useState } from "react";
import * as yup from "yup";

export default function ModalPago({ open, onClose, refresh, setRefresh, facturaData }: { open: boolean; onClose: () => void; setRefresh: (number: number) => void; refresh: number; facturaData: any; }) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{ amount: number; method: string; }>({ amount: facturaData?.total || 0, method: "EFECTIVO" });
  const [errors, setErrors] = useState({ amount: "", method: "" });
  const validationSchema = yup.object({ amount: yup.number().min(0.01, "El monto debe ser mayor a 0").required("*El monto es requerido"), method: yup.string().required("*El método de pago es requerido"), });

  const handleChange = (e: any) => { const { name, value } = e; setForm({ ...form, [name]: name === "amount" ? parseFloat(value) || 0 : value }); };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!facturaData) return;
      const pagoData = {
        idFactura: facturaData.id,
        montoPagado: form.amount,
        metodoPago: form.method,
        fechaPago: new Date().toISOString().split("T")[0],
      };
      registrarPago(pagoData)
        .then(() => {
          AlertSuccess("Pago registrado exitosamente");
          setRefresh(refresh + 1);
          onClose();
        })
        .catch((error: any) => {
          AlertError(String(error?.response?.data?.message || "Ocurrió un error"));
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"success.main"} color="white">Registrar Pago</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>Factura: #{facturaData?.id || "-"} - Total: Q {facturaData?.total?.toFixed(2) || "0.00"}</Typography>
        <Stack spacing={2} mt={1}>
          <TextInput label="Monto" name="amount" type="number" value={form.amount.toString()} onChange={handleChange} errorForm={!!errors.amount} helperTextForm={errors.amount} validations={validationSchema} />
          <SelectSimplyInput options={[{ id: "EFECTIVO", name: "Efectivo" }, { id: "TARJETA", name: "Tarjeta" }, { id: "TRANSFERENCIA", name: "Transferencia" }, { id: "CHEQUE", name: "Cheque" }]} label="Método de Pago" name="method" valueOptions="id" labelOptions="name" onChange={handleChange} value={{ id: form.method, name: form.method }} errorForm={!!errors.method} helperTextForm={errors.method} validations={validationSchema} variant="outlined" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="success">Registrar Pago</Button>
      </DialogActions>
    </Dialog>
  );
}

