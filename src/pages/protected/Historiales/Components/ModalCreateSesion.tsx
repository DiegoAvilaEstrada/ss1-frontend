import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { createSesion } from "@services/sesion.service";
import { getAllTratamientos } from "@services/tratamiento.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateSesion({
  open,
  onClose,
  refresh,
  setRefresh,
  tratamientoId,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  tratamientoId?: number | null;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    idTratamiento: { id: number; label: string } | null;
    fechaSesion: string;
    observaciones: string;
  }>({
    idTratamiento: null,
    fechaSesion: new Date().toISOString().split("T")[0],
    observaciones: "",
  });

  const [errors, setErrors] = useState({
    idTratamiento: "",
    fechaSesion: "",
    observaciones: "",
  });

  const [tratamientos, setTratamientos] = useState<any[]>([]);

  const validationSchema = yup.object({
    idTratamiento: yup.object().required("*El tratamiento es requerido"),
    fechaSesion: yup.string().required("*La fecha de sesión es requerida"),
    observaciones: yup.string().required("*Las observaciones son requeridas"),
  });

  useEffect(() => {
    if (open) {
      loadTratamientos();
      // Si se pasa un tratamientoId específico, establecerlo
      if (tratamientoId) {
        // Buscar el tratamiento en la lista cuando se carguen
        getAllTratamientos().then((res: any) => {
          const tratamientosList = res?.responseObject || res || [];
          const tratamiento = tratamientosList.find(
            (t: any) => t.id === tratamientoId
          );
          if (tratamiento) {
            setForm((prev) => ({
              ...prev,
              idTratamiento: {
                id: tratamiento.id,
                label: `Tratamiento #${tratamiento.id} - ${tratamiento.estadoTratamiento || ""}`,
              },
            }));
          }
        });
      }
    }
  }, [open, tratamientoId]);

  const loadTratamientos = async () => {
    try {
      const res = await getAllTratamientos();
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        setTratamientos(
          res.responseObject.map((t: any) => ({
            id: t.id,
            label: `Tratamiento #${t.id} - ${t.paciente?.nombre || ""} ${t.paciente?.apellido || ""} - ${t.estadoTratamiento || ""}`.trim(),
          }))
        );
      } else if (Array.isArray(res)) {
        setTratamientos(
          res.map((t: any) => ({
            id: t.id,
            label: `Tratamiento #${t.id} - ${t.paciente?.nombre || ""} ${t.paciente?.apellido || ""} - ${t.estadoTratamiento || ""}`.trim(),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando tratamientos:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!form.idTratamiento) {
        AlertError("Por favor selecciona un tratamiento");
        return;
      }

      const params = {
        idTratamiento: form.idTratamiento.id,
        fechaSesion: form.fechaSesion,
        observaciones: form.observaciones,
      };

      createSesion(params)
        .then((res: any) => {
          console.log("Sesión creada:", res);
          AlertSuccess("Sesión psicológica creada exitosamente");
          setRefresh(refresh + 1);
          onClose();
          resetForm();
        })
        .catch((error: any) => {
          console.error("Error creando sesión:", error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocurrió un error al crear la sesión";
          AlertError(errorMsg);
        });
    }
  };

  const resetForm = () => {
    setForm({
      idTratamiento: null,
      fechaSesion: new Date().toISOString().split("T")[0],
      observaciones: "",
    });
    setErrors({
      idTratamiento: "",
      fechaSesion: "",
      observaciones: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"success.main"} color="white">
        Crear Sesión Psicológica
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <SelectSimplyInput
            options={tratamientos}
            label="Tratamiento"
            name="idTratamiento"
            valueOptions="id"
            labelOptions="label"
            onChange={handleChange}
            value={form.idTratamiento}
            errorForm={!!errors.idTratamiento}
            helperTextForm={errors.idTratamiento}
            validations={validationSchema}
            variant="outlined"
          />

          <TextInput
            label="Fecha de Sesión"
            name="fechaSesion"
            type="date"
            value={form.fechaSesion}
            onChange={handleChange}
            errorForm={!!errors.fechaSesion}
            helperTextForm={errors.fechaSesion}
            validations={validationSchema}
          />

          <TextInput
            label="Observaciones"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            errorForm={!!errors.observaciones}
            helperTextForm={errors.observaciones}
            validations={validationSchema}
            maxCharacters={2000}
            multiline
            rows={6}
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
        <Button onClick={handleSave} variant="contained" color="success">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

