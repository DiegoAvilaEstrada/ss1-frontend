import { useAlert } from "@components/Alerts";
import { PasswordInput, TextInput } from "@components/inputs";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import { recoveryPassword } from "@services/cuentaPaciente.service";
import { validateForm } from "@utilities/Functions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const ResetPassword = () => {
  const { AlertSuccess, AlertError } = useAlert();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    username: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (validateForm(validationSchema, fields, setErrors)) {
      setLoading(true);
      try {
        const params = {
          username: fields.username,
          newPassword: fields.newPassword,
          confirmNewPassword: fields.confirmNewPassword,
        };
        
        const res = await recoveryPassword(params);
        
        if (res?.code === 200 || res?.status === 200) {
          AlertSuccess("Contraseña recuperada exitosamente");
          navigate("/login");
        } else {
          AlertError(res?.message || "Ocurrió un error al recuperar la contraseña");
        }
      } catch (error: any) {
        console.error("Error recuperando contraseña:", error);
        AlertError(
          String(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocurrió un error, inténtelo de nuevo"
          )
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e;
    setFields({ ...fields, [name]: value });
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("*El nombre de usuario es requerido")
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),

    newPassword: yup
      .string()
      .required("*La nueva contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(75, "Máximo 75 caracteres"),

    confirmNewPassword: yup
      .string()
      .required("*La confirmación de contraseña es requerida")
      .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
      .max(75, "Máximo 75 caracteres"),
  });

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 3,
        }}
        elevation={4}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          Recuperar contraseña
        </Typography>

        <Typography variant="body1" mb={3} color="text.secondary">
          Ingresa tu nombre de usuario y tu nueva contraseña para recuperar el acceso a tu cuenta.
        </Typography>

        <Stack spacing={2}>
          <TextInput
            label="Nombre de usuario"
            value={fields.username}
            name="username"
            onChange={handleChange}
            helperTextForm={errors.username}
            errorForm={!!errors.username}
            placeholder="Ingresa tu nombre de usuario"
          />

          <PasswordInput
            name="newPassword"
            label="Nueva contraseña"
            value={fields.newPassword}
            onChange={handleChange}
            helperTextForm={errors.newPassword}
            errorForm={!!errors.newPassword}
            placeholder="Mínimo 8 caracteres"
          />

          <PasswordInput
            label="Confirmar nueva contraseña"
            name="confirmNewPassword"
            value={fields.confirmNewPassword}
            onChange={handleChange}
            helperTextForm={errors.confirmNewPassword}
            errorForm={!!errors.confirmNewPassword}
            placeholder="Confirma tu nueva contraseña"
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              mt: 2,
            }}
            onClick={handleChangePassword}
            disabled={loading || !fields.username || !fields.newPassword || !fields.confirmNewPassword}
          >
            {loading ? "Procesando..." : "Recuperar contraseña"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              textTransform: "none",
            }}
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Volver a iniciar sesión
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
