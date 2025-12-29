import { useAlert } from "@components/Alerts";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { updateTratamiento } from "@services/tratamiento.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalUpdateEstadoTratamiento({
  open,
  onClose,
  refresh,
  setRefresh,
  tratamientoData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  tratamientoData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    estadoTratamiento: string;
  }>({
    estadoTratamiento: "",
  });

  const [errors, setErrors] = useState({
    estadoTratamiento: "",
  });

  const estadosOpciones = [
    "EN PROCESO",
    "CANCELADO",
    "FINALIZADO",
  ];

  const validationSchema = yup.object({
    estadoTratamiento: yup.string().required("*El estado del tratamiento es requerido"),
  });

  useEffect(() => {
    if (tratamientoData && open) {
      setForm({
        estadoTratamiento: tratamientoData.estadoTratamiento || tratamientoData.estado || "",
      });
    } else {
      setForm({
        estadoTratamiento: "",
      });
    }
  }, [tratamientoData, open]);

  const handleChange = (value: string | null) => {
    setForm({
      ...form,
      estadoTratamiento: value || "",
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (value) {
      setErrors({
        ...errors,
        estadoTratamiento: "",
      });
    }
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!tratamientoData?.id) {
        AlertError("No se ha seleccionado un tratamiento");
        return;
      }

      updateTratamiento(tratamientoData.id, { estadoTratamiento: form.estadoTratamiento })
        .then((res: any) => {
          console.log("Estado del tratamiento actualizado:", res);
          AlertSuccess("Estado del tratamiento actualizado exitosamente");
          setRefresh(refresh + 1);
          onClose();
          resetForm();
        })
        .catch((error: any) => {
          console.error("Error actualizando estado del tratamiento:", error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocurrió un error al actualizar el estado del tratamiento";
          AlertError(errorMsg);
        });
    }
  };

  const resetForm = () => {
    setForm({
      estadoTratamiento: "",
    });
    setErrors({
      estadoTratamiento: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"warning.main"} color="white">
        Actualizar Estado del Tratamiento
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <Autocomplete
            freeSolo
            options={estadosOpciones}
            value={form.estadoTratamiento}
            onChange={(event, newValue) => {
              handleChange(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              handleChange(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estado del Tratamiento"
                error={!!errors.estadoTratamiento}
                helperText={errors.estadoTratamiento || "Seleccione una opción o escriba un estado personalizado"}
                variant="outlined"
                fullWidth
              />
            )}
          />
          {errors.estadoTratamiento && (
            <FormHelperText error>{errors.estadoTratamiento}</FormHelperText>
          )}
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
        <Button onClick={handleSave} variant="contained" color="warning">
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

