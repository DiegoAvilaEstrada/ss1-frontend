import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { createTratamiento } from "@services/tratamiento.service";
import { getAllPacientes } from "@services/paciente.service";
import { getUserInfo } from "@utilities/Functions";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateTratamiento({
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
  const userInfo = getUserInfo();
  const [form, setForm] = useState<{
    dpiPaciente: { dpi: string; nombre: string } | null;
    psicologoDpi: string;
    medicado: boolean;
    fechaInicio: string;
    estadoTratamiento: string;
  }>({
    dpiPaciente: null,
    psicologoDpi: userInfo?.dpi || "",
    medicado: false,
    fechaInicio: new Date().toISOString().split("T")[0], // Fecha actual
    estadoTratamiento: "",
  });

  const [errors, setErrors] = useState({
    dpiPaciente: "",
    psicologoDpi: "",
    medicado: "",
    fechaInicio: "",
    estadoTratamiento: "",
  });

  const [pacientes, setPacientes] = useState<any[]>([]);

  const validationSchema = yup.object({
    dpiPaciente: yup.object().required("*El paciente es requerido"),
    psicologoDpi: yup.string().required("*El psicólogo es requerido"),
    medicado: yup.boolean().required(),
    fechaInicio: yup.string().required("*La fecha de inicio es requerida"),
    estadoTratamiento: yup.string().required("*El estado del tratamiento es requerido"),
  });

  useEffect(() => {
    if (open) {
      loadPacientes();
      // Establecer DPI del psicólogo desde userInfo
      if (userInfo?.dpi) {
        setForm((prev) => ({ ...prev, psicologoDpi: userInfo.dpi }));
      }
    }
  }, [open, userInfo]);

  const loadPacientes = async () => {
    try {
      const res = await getAllPacientes();
      if (res?.responseObject && Array.isArray(res.responseObject)) {
        setPacientes(
          res.responseObject.map((pac: any) => ({
            dpi: pac.dpi,
            nombre: `${pac.nombre || ""} ${pac.apellido || ""}`.trim(),
          }))
        );
      } else if (Array.isArray(res)) {
        setPacientes(
          res.map((pac: any) => ({
            dpi: pac.dpi,
            nombre: `${pac.nombre || ""} ${pac.apellido || ""}`.trim(),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e;
    setForm({
      ...form,
      [name]: name === "medicado" ? !form.medicado : value,
    });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (!form.dpiPaciente) {
        AlertError("Por favor selecciona un paciente");
        return;
      }

      const params = {
        dpiPaciente: form.dpiPaciente.dpi,
        psicologoDpi: form.psicologoDpi,
        medicado: form.medicado,
        fechaInicio: form.fechaInicio,
        estadoTratamiento: form.estadoTratamiento,
      };

      createTratamiento(params)
        .then((res: any) => {
          console.log("Tratamiento creado:", res);
          AlertSuccess("Tratamiento creado exitosamente");
          setRefresh(refresh + 1);
          onClose();
          resetForm();
        })
        .catch((error: any) => {
          console.error("Error creando tratamiento:", error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocurrió un error al crear el tratamiento";
          AlertError(errorMsg);
        });
    }
  };

  const resetForm = () => {
    setForm({
      dpiPaciente: null,
      psicologoDpi: userInfo?.dpi || "",
      medicado: false,
      fechaInicio: new Date().toISOString().split("T")[0],
      estadoTratamiento: "",
    });
    setErrors({
      dpiPaciente: "",
      psicologoDpi: "",
      medicado: "",
      fechaInicio: "",
      estadoTratamiento: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle bgcolor={"primary.main"} color="white">
        Crear Tratamiento
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <SelectSimplyInput
            options={pacientes}
            label="Paciente"
            name="dpiPaciente"
            valueOptions="dpi"
            labelOptions="nombre"
            onChange={handleChange}
            value={form.dpiPaciente}
            errorForm={!!errors.dpiPaciente}
            helperTextForm={errors.dpiPaciente}
            validations={validationSchema}
            variant="outlined"
          />

          <TextInput
            label="DPI del Psicólogo"
            name="psicologoDpi"
            value={form.psicologoDpi}
            onChange={handleChange}
            errorForm={!!errors.psicologoDpi}
            helperTextForm={errors.psicologoDpi}
            validations={validationSchema}
            maxCharacters={20}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.medicado}
                onChange={(e) =>
                  setForm({ ...form, medicado: e.target.checked })
                }
                name="medicado"
              />
            }
            label="Requiere medicación"
          />

          <TextInput
            label="Fecha de Inicio"
            name="fechaInicio"
            type="date"
            value={form.fechaInicio}
            onChange={handleChange}
            errorForm={!!errors.fechaInicio}
            helperTextForm={errors.fechaInicio}
            validations={validationSchema}
          />

          <TextInput
            label="Estado del Tratamiento"
            name="estadoTratamiento"
            value={form.estadoTratamiento}
            onChange={handleChange}
            errorForm={!!errors.estadoTratamiento}
            helperTextForm={errors.estadoTratamiento}
            validations={validationSchema}
            maxCharacters={1000}
            multiline
            rows={4}
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
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

