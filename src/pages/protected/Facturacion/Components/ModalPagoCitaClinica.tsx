import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { createFactura } from "@services/facturacion.service";
import { getAllTratamientos } from "@services/tratamiento.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalPagoCitaClinica({
  open,
  onClose,
  refresh,
  setRefresh,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    dpiPaciente: string;
    idTratamiento: { id: number; nombre?: string; descripcion?: string } | null;
    fechaEmision: string;
    montoTotal: number | "";
  }>({
    dpiPaciente: "",
    idTratamiento: null,
    fechaEmision: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
    montoTotal: "",
  });

  const [errors, setErrors] = useState({
    dpiPaciente: "",
    idTratamiento: "",
    fechaEmision: "",
    montoTotal: "",
  });

  const [tratamientos, setTratamientos] = useState<any[]>([]);
  const [loadingTratamientos, setLoadingTratamientos] = useState(false);

  const validationSchema = yup.object({
    dpiPaciente: yup.string().required("*El DPI del paciente es requerido"),
    idTratamiento: yup
      .object()
      .shape({
        id: yup.number().required("Seleccione un tratamiento válido"),
      })
      .required("*El tratamiento es requerido"),
    fechaEmision: yup
      .string()
      .required("*La fecha de emisión es requerida")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD"),
    montoTotal: yup
      .number()
      .min(0.01, "El monto total debe ser mayor a 0")
      .required("*El monto total es requerido"),
  });

  // Cargar tratamientos disponibles
  useEffect(() => {
    if (open) {
      setLoadingTratamientos(true);
      getAllTratamientos()
        .then((res: any) => {
          console.log("Tratamientos recibidos:", res);
          if (res?.responseObject && Array.isArray(res.responseObject)) {
            setTratamientos(
              res.responseObject.map((t: any) => ({
                id: t.id,
                nombre: t.nombre || t.descripcion || `Tratamiento ${t.id}`,
                descripcion: t.descripcion || "",
              }))
            );
          } else if (Array.isArray(res)) {
            setTratamientos(
              res.map((t: any) => ({
                id: t.id,
                nombre: t.nombre || t.descripcion || `Tratamiento ${t.id}`,
                descripcion: t.descripcion || "",
              }))
            );
          }
        })
        .catch((error) => {
          console.error("Error cargando tratamientos:", error);
          AlertError("Error al cargar los tratamientos disponibles");
        })
        .finally(() => {
          setLoadingTratamientos(false);
        });
    }
  }, [open, AlertError]);

  const handleChange = (e: any) => {
    const { name, value } = e;
    setForm({
      ...form,
      [name]:
        name === "montoTotal"
          ? value === "" ? "" : parseFloat(value) || 0
          : value,
    });
  };

  const resetForm = () => {
    setForm({
      dpiPaciente: "",
      idTratamiento: null,
      fechaEmision: new Date().toISOString().split("T")[0],
      montoTotal: "",
    });
    setErrors({
      dpiPaciente: "",
      idTratamiento: "",
      fechaEmision: "",
      montoTotal: "",
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      const { idTratamiento, ...rest } = form;
      const params = {
        ...rest,
        idTratamiento: form.idTratamiento?.id,
        montoTotal: Number(form.montoTotal),
      };

      handleCreate(params);
    }
  };

  const handleCreate = (params: any) => {
    createFactura(params)
      .then((res: any) => {
        console.log("Pago de cita clínica registrado:", res);
        AlertSuccess("Pago de cita clínica registrado exitosamente");
        setRefresh(refresh + 1);
        onClose();
        resetForm();
      })
      .catch((error: any) => {
        console.error("Error registrando pago de cita clínica:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocurrió un error al registrar el pago de la cita clínica";
        AlertError(errorMsg);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"success.main"} color="white">
        Pagar Cita Clínica
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="DPI del Paciente"
            name="dpiPaciente"
            value={form.dpiPaciente}
            onChange={handleChange}
            errorForm={!!errors.dpiPaciente}
            helperTextForm={errors.dpiPaciente}
            validations={validationSchema}
            maxCharacters={20}
          />

          {loadingTratamientos ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <SelectSimplyInput
              options={tratamientos}
              label="Tratamiento"
              name="idTratamiento"
              valueOptions="id"
              labelOptions="nombre"
              onChange={handleChange}
              value={form.idTratamiento}
              errorForm={!!errors.idTratamiento}
              helperTextForm={errors.idTratamiento}
              validations={validationSchema}
              variant="outlined"
            />
          )}

          <TextField
            label="Fecha de Emisión"
            name="fechaEmision"
            type="date"
            fullWidth
            value={form.fechaEmision}
            onChange={(e) => handleChange({ name: "fechaEmision", value: e.target.value })}
            error={!!errors.fechaEmision}
            helperText={errors.fechaEmision}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          <TextInput
            label="Monto Total"
            name="montoTotal"
            type="number"
            value={form.montoTotal === "" ? "" : form.montoTotal.toString()}
            onChange={handleChange}
            errorForm={!!errors.montoTotal}
            helperTextForm={errors.montoTotal}
            validations={validationSchema}
            inputProps={{
              step: "0.01",
              min: "0.01",
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            resetForm();
          }}
          color="error"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="success"
          disabled={loadingTratamientos}
        >
          Pagar Cita
        </Button>
      </DialogActions>
    </Dialog>
  );
}

