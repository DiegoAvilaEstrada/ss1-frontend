import { useAlert } from "@components/Alerts";
import { TextInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { createPaciente, updatePaciente } from "@services/paciente.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateUpdatePaciente({
  open,
  onClose,
  refresh,
  setRefresh,
  pacienteData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  pacienteData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    dpi: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    nit: string;
  }>({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    nit: "",
  });

  const [errors, setErrors] = useState({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    nit: "",
  });

  const validationSchema = yup.object({
    dpi: yup.string().required("*El DPI es requerido"),
    nombre: yup.string().required("*El nombre es requerido"),
    apellido: yup.string().required("*El apellido es requerido"),
    telefono: yup.string().required("*El teléfono es requerido"),
    email: yup.string().email("Email inválido").required("*El email es requerido"),
    nit: yup.string().required("*El NIT es requerido"),
  });

  const handleChange = (event: { value: string; name: string }) => {
    const { value, name } = event;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      if (pacienteData) {
        handleUpdate(form);
      } else {
        handleCreate(form);
      }
    }
  };

  const handleUpdate = (params: any) => {
    updatePaciente(params)
      .then((res: any) => {
        console.log("Paciente actualizado:", res);
        AlertSuccess("Paciente actualizado exitosamente");
        setRefresh(refresh + 1);
        onClose();
        resetForm();
      })
      .catch((error: any) => {
        console.error("Error actualizando paciente:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocurrió un error al actualizar el paciente";
        AlertError(errorMsg);
      });
  };

  const handleCreate = (params: any) => {
    createPaciente(params)
      .then((res: any) => {
        console.log("Paciente creado:", res);
        AlertSuccess("Paciente creado exitosamente");
        setRefresh(refresh + 1);
        onClose();
        resetForm();
      })
      .catch((error: any) => {
        console.error("Error creando paciente:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocurrió un error al crear el paciente";
        AlertError(errorMsg);
      });
  };

  const resetForm = () => {
    setForm({
      dpi: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      nit: "",
    });
    setErrors({
      dpi: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      nit: "",
    });
  };

  useEffect(() => {
    if (pacienteData) {
      setForm({
        dpi: pacienteData.dpi || "",
        nombre: pacienteData.nombre || "",
        apellido: pacienteData.apellido || "",
        telefono: pacienteData.telefono || "",
        email: pacienteData.email || "",
        nit: pacienteData.nit || "",
      });
    } else {
      resetForm();
    }
  }, [pacienteData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">
        {pacienteData ? "Editar Paciente" : "Registrar Paciente"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="DPI"
            name="dpi"
            value={form.dpi}
            onChange={handleChange}
            errorForm={!!errors.dpi}
            helperTextForm={errors.dpi}
            validations={validationSchema}
            maxCharacters={20}
          />
          <TextInput
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            errorForm={!!errors.nombre}
            helperTextForm={errors.nombre}
            validations={validationSchema}
            maxCharacters={100}
          />
          <TextInput
            label="Apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            errorForm={!!errors.apellido}
            helperTextForm={errors.apellido}
            validations={validationSchema}
            maxCharacters={100}
          />
          <TextInput
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            errorForm={!!errors.telefono}
            helperTextForm={errors.telefono}
            validations={validationSchema}
            maxCharacters={30}
          />
          <TextInput
            label="Email"
            name="email"
            maxCharacters={255}
            value={form.email}
            onChange={handleChange}
            errorForm={!!errors.email}
            helperTextForm={errors.email}
            validations={validationSchema}
          />
          <TextInput
            label="NIT"
            name="nit"
            value={form.nit}
            onChange={handleChange}
            errorForm={!!errors.nit}
            helperTextForm={errors.nit}
            validations={validationSchema}
            maxCharacters={20}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="info">
          {pacienteData ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
