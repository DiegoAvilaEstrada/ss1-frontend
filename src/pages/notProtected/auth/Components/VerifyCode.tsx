import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import { TextInput } from "@components/inputs";
import * as yup from "yup";
import { validateForm } from "@utilities/Functions";

interface VerifyCodeProps {
  code: string;
  setCode: (code: string) => void;
  onVerify: () => void;
  onBack: () => void;
  loading: boolean;
  userType: "paciente" | "empleado";
}

const VerifyCode = ({
  code,
  setCode,
  onVerify,
  onBack,
  loading,
  userType,
}: VerifyCodeProps) => {
  const [errors, setErrors] = useState({
    code: "",
  });

  const validationSchema = yup.object({
    code: yup.string().required("*El código es requerido"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(validationSchema, { code }, setErrors)) {
      onVerify();
    }
  };

  const handleChange = (event: { value: string; name: string }) => {
    const { value } = event;
    setCode(value);
    // Limpiar error cuando el usuario empiece a escribir
    if (errors.code) {
      setErrors({ code: "" });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: "background.default", px: 2 }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            color="primary"
            mb={1}
          >
            Verificación de Código
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Ingresa el código que enviamos a tu correo electrónico.
            {userType === "paciente" ? " (Paciente)" : " (Empleado)"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextInput
                label="Código de verificación"
                value={code}
                name="code"
                validations={validationSchema}
                errorForm={!!errors.code}
                helperTextForm={errors.code}
                onChange={handleChange}
                maxCharacters={10}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.3, borderRadius: 2 }}
                fullWidth
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </Button>

              <Button
                variant="text"
                color="secondary"
                sx={{ fontWeight: 600 }}
                onClick={onBack}
                fullWidth
              >
                Regresar
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyCode;
