import { useAlert } from "@components/Alerts";
import { TextInput, SelectSimplyInput } from "@components/inputs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { createEmpleado, updateEmpleado } from "@services/empleado.service";
import { getAllRoles } from "@services/role.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateUpdateEmpleado({
  open,
  onClose,
  refresh,
  setRefresh,
  empleadoData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  empleadoData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    dpi: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    salario: number;
    idRolEmpleado: { id: number; name: string } | null;
    descuentoIgss: number;
  }>({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    salario: 0,
    idRolEmpleado: null,
    descuentoIgss: 0,
  });

  const [errors, setErrors] = useState({
    dpi: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    salario: "",
    idRolEmpleado: "",
    descuentoIgss: "",
  });
  const [roles, setRoles] = useState<any[]>([]);

  const validationSchema = yup.object({
    dpi: yup.string().required("*El DPI es requerido"),
    nombre: yup.string().required("*El nombre es requerido"),
    apellido: yup.string().required("*El apellido es requerido"),
    telefono: yup.string().required("*El teléfono es requerido"),
    email: yup.string().email("Email inválido").required("*El email es requerido"),
    salario: yup.number().min(0, "El salario debe ser mayor o igual a 0").required("*El salario es requerido"),
    idRolEmpleado: yup.object().required("*El rol es requerido"),
    descuentoIgss: yup.number().min(0, "El descuento IGSS debe ser mayor o igual a 0").max(100, "El descuento IGSS no puede ser mayor a 100").required("*El descuento IGSS es requerido"),
  });

  useEffect(() => {
    getAllRoles()
      .then((res: any) => {
        console.log("Roles recibidos:", res);
        if (res?.responseObject && Array.isArray(res.responseObject)) {
          setRoles(res.responseObject.map((r: any) => ({ id: r.id, name: r.rol })));
        } else if (Array.isArray(res)) {
          setRoles(res.map((r: any) => ({ id: r.id, name: r.rol })));
        }
      })
      .catch((error: any) => {
        console.error("Error cargando roles:", error);
      });
  }, []);

  const resetForm = () => {
    setForm({
      dpi: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      salario: 0,
      idRolEmpleado: null,
      descuentoIgss: 0,
    });
    setErrors({
      dpi: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      salario: "",
      idRolEmpleado: "",
      descuentoIgss: "",
    });
  };

  useEffect(() => {
    if (empleadoData) {
      setForm({
        dpi: empleadoData.dpi || "",
        nombre: empleadoData.nombre || "",
        apellido: empleadoData.apellido || "",
        telefono: empleadoData.telefono || "",
        email: empleadoData.email || "",
        salario: empleadoData.salario || 0,
        idRolEmpleado: empleadoData.rolEmpleado
          ? { id: empleadoData.rolEmpleado.id, name: empleadoData.rolEmpleado.rol }
          : null,
        descuentoIgss: empleadoData.descuentoIgss || 0,
      });
    } else {
      resetForm();
    }
  }, [empleadoData, open]);

  const handleChange = (e: any) => {
    const { name, value } = e;
    setForm({
      ...form,
      [name]:
        name === "salario" || name === "descuentoIgss"
          ? parseFloat(value) || 0
          : name === "idRolEmpleado"
          ? value
          : value,
    });
  };

  const handleCreate = (params: any) => {
    createEmpleado(params)
      .then((res: any) => {
        console.log("Empleado creado:", res);
        AlertSuccess("Empleado creado exitosamente");
        setRefresh(refresh + 1);
        onClose();
        resetForm();
      })
      .catch((error: any) => {
        console.error("Error creando empleado:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocurrió un error al crear el empleado";
        AlertError(errorMsg);
      });
  };

  const handleUpdate = (params: any) => {
    updateEmpleado(params)
      .then((res: any) => {
        console.log("Empleado actualizado:", res);
        AlertSuccess("Empleado actualizado exitosamente");
        setRefresh(refresh + 1);
        onClose();
        resetForm();
      })
      .catch((error: any) => {
        console.error("Error actualizando empleado:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocurrió un error al actualizar el empleado";
        AlertError(errorMsg);
      });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      const { idRolEmpleado, ...rest } = form;
      const params = {
        ...rest,
        idRolEmpleado: form.idRolEmpleado?.id || 0,
      };

      if (empleadoData) {
        handleUpdate(params);
      } else {
        handleCreate(params);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">
        {empleadoData ? "Editar Empleado" : "Registrar Empleado"}
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
            label="Salario"
            name="salario"
            type="number"
            value={form.salario.toString()}
            onChange={handleChange}
            errorForm={!!errors.salario}
            helperTextForm={errors.salario}
            validations={validationSchema}
          />
          <SelectSimplyInput
            options={roles}
            label="Rol"
            name="idRolEmpleado"
            valueOptions="id"
            labelOptions="name"
            onChange={handleChange}
            value={form.idRolEmpleado}
            errorForm={!!errors.idRolEmpleado}
            helperTextForm={errors.idRolEmpleado}
            validations={validationSchema}
            variant="outlined"
          />
          <TextInput
            label="Descuento IGSS (%)"
            name="descuentoIgss"
            type="number"
            value={form.descuentoIgss.toString()}
            onChange={handleChange}
            errorForm={!!errors.descuentoIgss}
            helperTextForm={errors.descuentoIgss}
            validations={validationSchema}
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
        <Button onClick={handleSave} variant="contained" color="info">
          {empleadoData ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
