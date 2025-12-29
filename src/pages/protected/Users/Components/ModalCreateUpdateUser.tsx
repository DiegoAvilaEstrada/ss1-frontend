import { useAlert } from "@components/Alerts";
import { SelectSimplyInput, TextInput } from "@components/inputs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { getAllRoles } from "@services/role.service";
import { createUser, updateUser } from "@services/user.service";
import { validateForm } from "@utilities/Functions";
import { useEffect, useState } from "react";
import * as yup from "yup";

export default function ModalCreateUpdateUser({
  open,
  onClose,
  refresh,
  setRefresh,
  userData,
}: {
  open: boolean;
  onClose: () => void;
  setRefresh: (number: number) => void;
  refresh: number;
  userData: any;
}) {
  const { AlertError, AlertSuccess } = useAlert();
  const [form, setForm] = useState<{
    name: string;
    email: string;
    lastName: string;
    roleId: { id: number; name: string } | null;
  }>({
    name: "",
    email: "",
    lastName: "",
    roleId: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    lastName: "",
    roleId: "",
  });
  const [roles, setRoles] = useState<any[]>([]);

  const handleChange = (e: any) => {
    const { name, value } = e;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    if (validateForm(validationSchema, form, setErrors)) {
      const { roleId, ...rest } = form;
      const params = { ...rest, roleId: form.roleId?.id };
      if (userData) {
        handleUpdateUser(params, userData.id);
      } else {
        handleCreate(params);
      }
    }
  };

  const handleCreate = (params: any) => {
    createUser(params)
      .then((res) => {
        if (res.status == 200) {
          onClose();
          AlertSuccess("Usuario creado");
          setRefresh(refresh + 1);
        }
      })
      .catch((error: any) => {
        AlertError(
          String(
            error?.response?.data?.message ||
              "Ocurrio un error, intentelo de nuevo"
          )
        );
      });
  };

  const handleUpdateUser = (params: any, id: number) => {
    updateUser(params, id)
      .then((res) => {
        if (res.status == 200) {
          onClose();
          AlertSuccess(userData ? "Usuario actualizado" : "Usuario creado");
          setRefresh(refresh + 1);
        }
      })
      .catch((error: any) => {
        AlertError(
          String(
            error?.response?.data?.message ||
              "Ocurrio un error, intentelo de nuevo"
          )
        );
      });
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("El correo no es correcto")
      .required("*El correo electronico es requerido")
      .max(75),
    name: yup.string().required("*El nombre es requerido").max(50),
    lastName: yup.string().required("*El apellido es requerido").max(50),
    roleId: yup
      .object({
        id: yup.number().required("Seleccione un rol válido"),
        name: yup.string().required(),
      })
      .required("*El rol es obligatorio"),
  });

  useEffect(() => {
    getAllRoles()
      .then((res) => {
        if (res.status == 200) {
          setRoles(res.data);
        }
      })
      .catch(() => {});

    setForm({
      email: "",
      name: "",
      lastName: "",
      roleId: null,
    });

    if (userData) {
      setForm({
        ...form,
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        roleId: { id: userData.roleId, name: userData.role.name },
      });
    }
  }, [userData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle bgcolor={"primary.main"} color="white">
        {userData ? "Editar usuario" : "Crear Usuario"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            errorForm={!!errors.name}
            helperTextForm={errors.name}
            validations={validationSchema}
            maxCharacters={50}
          />
          <TextInput
            label="Apellido"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            errorForm={!!errors.lastName}
            helperTextForm={errors.lastName}
            validations={validationSchema}
            maxCharacters={50}
          />
          <TextInput
            label="Correo"
            name="email"
            maxCharacters={75}
            value={form.email}
            onChange={handleChange}
            errorForm={!!errors.email}
            helperTextForm={errors.email}
            validations={validationSchema}
          />
          <SelectSimplyInput
            options={roles}
            label="Rol"
            name="roleId"
            valueOptions="id"
            labelOptions="name"
            onChange={handleChange}
            value={form.roleId}
            errorForm={!!errors.roleId}
            helperTextForm={errors.roleId}
            validations={validationSchema}
            variant="outlined"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancelar
        </Button>

        <Button onClick={handleSave} variant="contained" color="info">
          {userData ? "Editar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
