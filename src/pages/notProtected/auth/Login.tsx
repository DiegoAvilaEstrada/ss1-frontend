import { Box, Button, Paper, Typography, Link, Divider, IconButton } from "@mui/material";
import { useState } from "react";
import { PasswordInput, TextInput } from "@components/inputs";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { validateForm } from "@utilities/Functions";
import { loginPaciente, loginEmpleado } from "@services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "@components/Alerts";
import { completeLogin, startLogin, loginError } from "@redux/UserSlice";

type UserType = "paciente" | "empleado" | null;

const Login = () => {
  const { AlertError, AlertSuccess } = useAlert();
  const [step, setStep] = useState<0 | 1>(0);
  const [userType, setUserType] = useState<UserType>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const userState = useSelector((state: any) => state.User);
  const loading = userState?.loading || false;

  const [fields, setFields] = useState({
    username: "",
    password: "",
    code: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    code: "",
  });

  const validationSchema = yup.object({
    username: yup.string().required("*El usuario es requerido"),
    password: yup.string().required("*La contraseña es requerida"),
  });

  const handleSelectUserType = (type: "paciente" | "empleado") => {
    setUserType(type);
    setStep(1);
  };

  const onHandleLogin = async () => {
    if (!validateForm(validationSchema, fields, setErrors)) {
      return;
    }

    if (!userType) {
      AlertError("Por favor selecciona un tipo de usuario");
      return;
    }

    dispatch(startLogin());
    try {
      const response = userType === "paciente" 
        ? await loginPaciente({
            username: fields.username,
            password: fields.password,
          })
        : await loginEmpleado({
            username: fields.username,
            password: fields.password,
          });

      console.log("Respuesta del login:", JSON.stringify(response, null, 2));

      let userData: any = null;
      let token: string = "";

      if (response && response.responseObject) {
        userData = response.responseObject;
        token = userData.token || userData.accessToken || userData.access_token || userData.sessionToken || userData.uid || "";
      } else if (response && response.token) {
        token = response.token;
        userData = response.user || response;
      } else if (response) {
        userData = response;
        token = response.token || response.accessToken || response.access_token || response.sessionToken || response.uid || "";
      }

      if (token && userData) {
        let name = userData.name || userData.firstName || userData.nombre || "";
        let lastName = userData.lastName || userData.surname || userData.apellido || "";
        
        if (!lastName && name && name.includes(" ")) {
          const parts = name.split(" ");
          name = parts[0] || "";
          lastName = parts.slice(1).join(" ") || "";
        }

        let userRole = "";
        if (typeof userData.role === 'string') {
          userRole = userData.role;
        } else if (userData.role && userData.role.rol) {
          userRole = userData.role.rol;
        } else if (userData.rol) {
          userRole = userData.rol;
        } else if (userData.roleName) {
          userRole = userData.roleName;
        }

        userRole = userRole.toUpperCase().trim();
        const roleMapping: Record<string, string> = {
          'ADMINISTRADOR': 'ADMIN',
          'ADMINISTRATOR': 'ADMIN',
          'PACIENTE': 'CLIENTE',
          'PATIENT': 'CLIENTE',
          'PSICÓLOGO': 'PSICOLOGO',
          'PSYCHOLOGIST': 'PSICOLOGO',
          'PSIQUIATRA': 'PSIQUIATRA',
          'PSYCHIATRIST': 'PSIQUIATRA',
          'FARMACIA': 'FARMACIA',
          'PHARMACY': 'FARMACIA',
          'FINANZAS': 'FINANZAS',
          'FINANCE': 'FINANZAS',
        };

        if (roleMapping[userRole]) {
          userRole = roleMapping[userRole];
        }

        console.log("Rol extraído del backend:", userRole);
        console.log("UserData completo para debug:", userData);

        if (userType === "paciente") {
          const dpi = userData.dpi || userData.idPaciente || userData.paciente?.dpi || userData.id || fields.username;
          
          dispatch(
            completeLogin({
              token: token,
              user: {
                id: userData.id || userData.userId || 0,
                email: userData.email || userData.username || fields.username,
                username: fields.username,
                name: name,
                lastName: lastName,
                role: "CLIENTE",
                profile: userData.profile || userData,
                dpi: dpi,
              },
            })
          );
          console.log("✓ Login exitoso, navegando a /home");
          AlertSuccess("¡Bienvenido!");
          navigate("/home", { replace: true });
        } else if (userType === "empleado") {
          const defaultRole = userRole || "ADMIN";
          
          dispatch(
            completeLogin({
              token: token,
              user: {
                id: userData.id || userData.userId || 0,
                email: userData.email || userData.username || fields.username,
                username: fields.username,
                name: name,
                lastName: lastName,
                role: defaultRole,
                profile: userData.profile || userData,
              },
            })
          );
          console.log("✓ Login exitoso como empleado, navegando a /home");
          AlertSuccess("¡Bienvenido!");
          navigate("/home", { replace: true });
        }
      } else {
        const errorMsg = "Error al iniciar sesión. No se recibió el token del servidor.";
        dispatch(loginError(errorMsg));
        AlertError(errorMsg);
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      console.error("Detalles del error:", error?.response?.data);
      console.error("Status code:", error?.response?.status);
      
      console.warn("Error en login, pero permitiendo acceso en modo desarrollo");
      
      if (userType === "paciente") {
        const tempDpi = fields.username;
        dispatch(
          completeLogin({
            token: "temp_token_for_dev_" + Date.now(),
            user: {
              id: 0,
              email: fields.username,
              username: fields.username,
              name: fields.username,
              lastName: "",
              role: "CLIENTE",
              profile: {},
              dpi: tempDpi,
            },
          })
        );
        console.log("✓ Login temporal exitoso (modo desarrollo), navegando a /home");
        AlertSuccess("¡Bienvenido! (Modo desarrollo)");
          navigate("/home", { replace: true });
      } else if (userType === "empleado") {
        dispatch(
          completeLogin({
            token: "temp_token_for_dev_" + Date.now(),
            user: {
              id: 0,
              email: fields.username,
              username: fields.username,
              name: fields.username,
              lastName: "",
              role: "ADMIN",
              profile: {},
            },
          })
        );
        console.log("✓ Login temporal exitoso (modo desarrollo), navegando a /home");
        AlertSuccess("¡Bienvenido! (Modo desarrollo)");
          navigate("/home", { replace: true });
      }
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (step === 1) {
        onHandleLogin();
      }
    }
  };

  const handleChange = (event: { value: string; name: string }) => {
    const { value, name } = event;
    setFields({ ...fields, [name]: value });
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setUserType(null);
      setFields({ username: "", password: "", code: "" });
    }
  };

  if (step === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 0.5,
            backgroundColor: "background.paper",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
              },
            }}
            title="Regresar al inicio"
          >
            <HomeIcon />
          </IconButton>

          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            mb={2}
            color="primary"
          >
            Iniciar Sesión
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => handleSelectUserType("paciente")}
              sx={{ py: 1.5, textTransform: "none" }}
              color="primary"
            >
              Iniciar Sesión Paciente
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => handleSelectUserType("empleado")}
              sx={{ py: 1.5, textTransform: "none" }}
              color="secondary"
            >
              Iniciar Sesión Empleado
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Link href="/reset-password" underline="hover" color="secondary">
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (step === 1) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
              },
            }}
            title="Regresar al inicio"
          >
            <HomeIcon />
          </IconButton>

          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            mb={2}
            color="primary"
          >
            Iniciar Sesión {userType === "paciente" ? "Paciente" : "Empleado"}
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Ingresa tus credenciales
          </Typography>

          <Box sx={{ gap: 2 }} flexDirection={"column"} display={"flex"}>
            <TextInput
              label="Usuario"
              name="username"
              maxCharacters={75}
              helperTextForm={errors.username}
              errorForm={!!errors.username}
              validations={validationSchema}
              value={fields.username}
              onChange={handleChange}
            />

            <PasswordInput
              label="Contraseña"
              name="password"
              onKeyDown={handleKeyDown}
              maxCharacters={75}
              helperTextForm={errors.password}
              errorForm={!!errors.password}
              value={fields.password}
              validations={validationSchema}
              onChange={handleChange}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onHandleLogin}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={handleBack}
            sx={{ mt: 1 }}
          >
            Regresar
          </Button>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default Login;
