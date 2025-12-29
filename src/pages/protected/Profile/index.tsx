import { useAlert } from "@components/Alerts";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { updateUserFields } from "@redux/UserSlice";
import { apiUrl } from "@services/api.service";
import { getMyInfo, updateMyInfo } from "@services/user.service";
import { getAreaEmpleadoById } from "@services/empleado.service";
import { getAllCuentasPacientes } from "@services/cuentaPaciente.service";
import { getUserInfo, getRole } from "@utilities/Functions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const index = () => {
  const dispatch = useDispatch();
  const { AlertError, AlertSuccess } = useAlert();
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dpi: "",
    rol: "",
    profileUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("name", fields.nombre);
    formData.append("lastName", fields.apellido);

    if (imageFile) {
      formData.append("imageProfile", imageFile);
    }

    await updateMyInfo(formData)
      .then((res: any) => {
        AlertSuccess("Perfil actualizado");
        setRefresh(refresh + 1);
        const profileUrl = res?.data?.profileUrl || res?.profileUrl;
        dispatch(
          updateUserFields({
            name: `${fields.nombre} ${fields.apellido}`,
            profile: profileUrl,
          })
        );
      })
      .catch((error: any) => {
        AlertError(
          String(
            error?.response?.data?.message ||
              "Ocurrió un error, intentelo de nuevo"
          )
        );
      });
  };

  useEffect(() => {
    setLoading(true);
    // Obtener datos del usuario logueado primero para obtener el ID del área-empleado
    const userInfo = getUserInfo();
    const userRole = getRole();
    
    // Si el usuario es un paciente (CLIENTE), obtener información del endpoint cuenta-paciente
    if (userRole === "CLIENTE" || userInfo?.role === "CLIENTE") {
      // Intentar obtener todas las cuentas de pacientes y buscar por username o email
      getAllCuentasPacientes()
        .then((res: any) => {
          console.log("Todas las cuentas de pacientes:", res);
          const cuentas = res?.responseObject || res || [];
          
          // Buscar la cuenta que coincida con el usuario logueado
          // Intentar por username, email, o nombre
          let cuentaEncontrada = null;
          
          if (Array.isArray(cuentas)) {
            // Buscar por username (si está guardado)
            if (userInfo?.username) {
              cuentaEncontrada = cuentas.find((c: any) => c.username === userInfo.username);
            }
            
            // Si no se encontró, buscar por email
            if (!cuentaEncontrada && userInfo?.email) {
              cuentaEncontrada = cuentas.find((c: any) => 
                c.paciente?.email === userInfo.email || 
                c.username === userInfo.email.split("@")[0]
              );
            }
            
            // Si aún no se encontró, buscar por nombre (formato username)
            if (!cuentaEncontrada && userInfo?.name) {
              const usernameFromName = userInfo.name.toLowerCase().replace(/\s+/g, ".");
              cuentaEncontrada = cuentas.find((c: any) => c.username === usernameFromName);
            }
          }
          
          console.log("Cuenta paciente encontrada:", cuentaEncontrada);
          
          if (cuentaEncontrada?.paciente) {
            const paciente = cuentaEncontrada.paciente;
            setFields({
              nombre: paciente.nombre || "",
              apellido: paciente.apellido || "",
              email: paciente.email || userInfo?.email || "",
              telefono: paciente.telefono || "",
              dpi: paciente.dpi || userInfo?.dpi || "",
              rol: "PACIENTE",
              profileUrl: userInfo?.profile || "",
            });
          } else {
            // Si no se encuentra, usar datos básicos
            const nameParts = userInfo?.name ? userInfo.name.split(" ") : [];
            setFields({
              nombre: nameParts[0] || "",
              apellido: nameParts.slice(1).join(" ") || "",
              email: userInfo?.email || "",
              telefono: "",
              dpi: userInfo?.dpi || "",
              rol: "PACIENTE",
              profileUrl: userInfo?.profile || "",
            });
          }
          setLoading(false);
        })
        .catch((error: any) => {
          console.error("Error obteniendo cuentas de pacientes:", error);
          // Si falla, usar datos básicos
          const nameParts = userInfo?.name ? userInfo.name.split(" ") : [];
          setFields({
            nombre: nameParts[0] || "",
            apellido: nameParts.slice(1).join(" ") || "",
            email: userInfo?.email || "",
            telefono: "",
            dpi: userInfo?.dpi || "",
            rol: "PACIENTE",
            profileUrl: userInfo?.profile || "",
          });
          setLoading(false);
        });
      return;
    }
    
    // Si es empleado, continuar con la lógica existente
    // Primero obtener la información completa del usuario para encontrar el ID del área-empleado
    getMyInfo()
      .then((res: any) => {
        console.log("Respuesta getMyInfo:", res);
        const userData = res?.data || res?.responseObject || res;
        
        // Buscar el ID del área-empleado en la respuesta
        // Puede estar en userData.areaEmpleado?.id, userData.empleado?.id, userData.idEmpleado, etc.
        const areaEmpleadoId = userData?.areaEmpleado?.id || 
                               userData?.empleado?.id || 
                               userData?.idEmpleado || 
                               userData?.id;

        if (areaEmpleadoId) {
          // Usar el endpoint /area-empleado/{id} para obtener los datos del empleado
          return getAreaEmpleadoById(Number(areaEmpleadoId))
            .then((areaRes: any) => {
              console.log("Respuesta getAreaEmpleadoById:", areaRes);
              const empleadoData = areaRes?.responseObject || areaRes?.data || areaRes;
              
              if (empleadoData) {
                setFields({
                  nombre: empleadoData.empleado?.nombre || empleadoData.nombre || userData.name?.split(" ")[0] || "",
                  apellido: empleadoData.empleado?.apellido || empleadoData.apellido || userData.name?.split(" ").slice(1).join(" ") || "",
                  email: empleadoData.empleado?.email || empleadoData.email || userData.email || userInfo?.email || "",
                  telefono: empleadoData.empleado?.telefono || empleadoData.telefono || "",
                  dpi: empleadoData.empleado?.dpi || empleadoData.dpi || userData.dpi || userInfo?.dpi || "",
                  rol: empleadoData.empleado?.rolEmpleado?.rol || empleadoData.rolEmpleado?.rol || empleadoData.rol || userData.role?.name || userData.role || userInfo?.role || "",
                  profileUrl: userData.profileUrl || userData.profile || userInfo?.profile || "",
                });

                if (userData.profileUrl || userData.profile || userInfo?.profile) {
                  setPreview(`${apiUrl}${userData.profileUrl || userData.profile || userInfo.profile}`);
                }
              }
              setLoading(false);
            })
            .catch((error: any) => {
              console.error("Error obteniendo información del área-empleado:", error);
              // Si falla, usar los datos básicos del usuario
              const nameParts = userData.name ? userData.name.split(" ") : [];
              setFields({
                nombre: nameParts[0] || "",
                apellido: nameParts.slice(1).join(" ") || "",
                email: userData.email || userInfo?.email || "",
                telefono: "",
                dpi: userData.dpi || userInfo?.dpi || "",
                rol: userData.role?.name || userData.role || userInfo?.role || "",
                profileUrl: userData.profileUrl || userData.profile || userInfo?.profile || "",
              });
              if (userData.profileUrl || userData.profile || userInfo?.profile) {
                setPreview(`${apiUrl}${userData.profileUrl || userData.profile || userInfo.profile}`);
              }
              setLoading(false);
            });
        } else {
          // Si no hay ID de área-empleado, usar los datos del usuario
          const nameParts = userData.name ? userData.name.split(" ") : [];
          setFields({
            nombre: nameParts[0] || "",
            apellido: nameParts.slice(1).join(" ") || "",
            email: userData.email || userInfo?.email || "",
            telefono: "",
            dpi: userData.dpi || userInfo?.dpi || "",
            rol: userData.role?.name || userData.role || userInfo?.role || "",
            profileUrl: userData.profileUrl || userData.profile || userInfo?.profile || "",
          });
          if (userData.profileUrl || userData.profile || userInfo?.profile) {
            setPreview(`${apiUrl}${userData.profileUrl || userData.profile || userInfo.profile}`);
          }
          setLoading(false);
        }
      })
      .catch((error: any) => {
        console.error("Error obteniendo información del usuario:", error);
        setLoading(false);
        AlertError("Error al cargar la información del usuario");
      });
  }, [refresh]);

  const avatarSrc = preview
    ? preview
    : fields.profileUrl
    ? `${apiUrl}${fields.profileUrl}`
    : "";

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={4} mb={4}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Mi Perfil
          </Typography>

          <Box display="flex" justifyContent="center" mt={2} mb={2}>
            <Avatar
              src={avatarSrc || undefined}
              alt={`${fields.nombre} ${fields.apellido}`}
              sx={{ width: 120, height: 120, fontSize: 40 }}
            >
              {!avatarSrc &&
                `${fields.nombre?.[0] || ""}${fields.apellido?.[0] || ""}`}
            </Avatar>
          </Box>

          <Box display="flex" justifyContent="center" mb={3}>
            <Button variant="outlined" component="label">
              Cambiar Foto
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
            {fields.rol === "PACIENTE" || fields.rol === "CLIENTE" ? "Datos del Paciente" : "Datos del Empleado"}
          </Typography>

          <TextField
            label="Nombre"
            value={fields.nombre}
            onChange={(e) => setFields({ ...fields, nombre: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Apellido"
            value={fields.apellido}
            onChange={(e) => setFields({ ...fields, apellido: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Email"
            value={fields.email}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
            sx={{ backgroundColor: "action.disabledBackground" }}
          />

          <TextField
            label="Teléfono"
            value={fields.telefono}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
            sx={{ backgroundColor: "action.disabledBackground" }}
          />

          <TextField
            label="DPI"
            value={fields.dpi}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
            sx={{ backgroundColor: "action.disabledBackground" }}
          />

          <TextField
            label="Rol"
            value={fields.rol}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
            sx={{ backgroundColor: "action.disabledBackground" }}
          />

          <Divider sx={{ my: 2 }} />

          <Box mt={2} textAlign="right">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default index;
