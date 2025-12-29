import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  Link,
  Stack,
} from "@mui/material";
import { PasswordInput } from "@components/inputs";
import { useState } from "react";
import * as yup from "yup";
import { validateForm } from "@utilities/Functions";
import { resetPasswordInit } from "@services/auth.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAlert } from "@components/Alerts";
import { completeLogin } from "@redux/UserSlice";

export const ResetPasswordInit = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { AlertError } = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [fields, setfields] = useState({
    email: email,
    oldPassword: password,
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (event: { value: string; name: string }) => {
    const { value, name } = event;
    setfields({ ...fields, [name]: value });
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("El correo no es correcto")
      .required("*El correo electronico es requerido"),

    oldPassword: yup
      .string()
      .required("*La contraseña es requerida")
      .max(75, "La contraseña es muy larga")
      .min(8, "La contraseña es muy corta"),

    newPassword: yup
      .string()
      .required("*La contraseña es requerida")
      .max(75, "La contraseña es muy larga")
      .min(8, "La contraseña es muy corta"),
  });
  const onSubmitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm(validationSchema, fields, setErrors)) {
      try {
        const res = await resetPasswordInit(fields);
        dispatch(completeLogin(res.data));
        navigate("/home");
      } catch (error: any) {
        AlertError(
          String(
            error?.response?.data?.message ||
              "Ocurrio un error, intentelo de nuevo"
          )
        );
      }
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
          Restablecer Contraseña
        </Typography>

        <Box component={"form"} onSubmit={onSubmitResetPassword}>
          <Stack spacing={2}>
            <TextField
              label="Correo electrónico"
              type="email"
              variant="outlined"
              fullWidth
              value={fields.email}
              required
              disabled
            />

            <PasswordInput
              name="newPassword"
              onChange={handleChange}
              validations={validationSchema}
              label="Nueva contraseña"
              value={fields.newPassword}
              errorForm={!!errors.newPassword}
              helperTextForm={errors.newPassword}
            />

            <Button
              variant="contained"
              type="submit"
              onClick={onSubmitResetPassword}
              fullWidth
              sx={{ mt: 1, py: 1 }}
            >
              Actualizar contraseña
            </Button>
          </Stack>
        </Box>

        <Typography textAlign="center" mt={3}>
          <Link href="/login" underline="hover">
            Volver al inicio de sesión
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};
