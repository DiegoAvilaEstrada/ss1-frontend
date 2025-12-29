import { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  MenuItem,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import { AccountCircle, Logout, MenuOutlined } from "@mui/icons-material";
import { SwitchTheme } from "./SwitchTheme";
import { ThemeContext } from "../../contexts/theme-context";
import ThemeApp from "../../styles/theme-app";
import { logout } from "@redux/UserSlice";
import { apiUrl } from "@services/api.service";
import { getRole, getUserInfo } from "@utilities/Functions";
import { getAllCuentasPacientes } from "@services/cuentaPaciente.service";
import { getAreaEmpleadoById } from "@services/empleado.service";
import { getMyInfo } from "@services/user.service";

interface HeaderProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

function Header({ drawerWidth, handleDrawerToggle }: HeaderProps) {
  const { theme, setTheme } = useContext(ThemeContext);
  const { userInfo, userToken } = useSelector((state: any) => state.User);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [nombreCompleto, setNombreCompleto] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = getRole();
  const isPaciente = role === "CLIENTE";

  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const themeSidebar = useTheme();

  const changeMode = () => {
    const current = theme && theme === "dark" ? "light" : "dark";
    setTheme(current);
    localStorage.setItem("dark-mode", current);
    ThemeApp(current);
  };

  // Cargar nombre completo del usuario
  useEffect(() => {
    const loadNombreCompleto = async () => {
      if (isPaciente) {
        // Para pacientes, obtener desde getAllCuentasPacientes
        try {
          const cuentasRes = await getAllCuentasPacientes();
          const cuentas = cuentasRes?.responseObject || cuentasRes || [];
          
          if (Array.isArray(cuentas)) {
            let cuentaEncontrada = null;
            const userInfoLocal = getUserInfo();
            
            // Buscar por username
            if (userInfoLocal?.username) {
              cuentaEncontrada = cuentas.find((c: any) => c.username === userInfoLocal.username);
            }
            
            // Si no se encontró, buscar por email
            if (!cuentaEncontrada && userInfoLocal?.email) {
              cuentaEncontrada = cuentas.find((c: any) => 
                c.paciente?.email === userInfoLocal.email || 
                c.username === userInfoLocal.email.split("@")[0]
              );
            }
            
            // Si encontramos la cuenta, usar el nombre completo del paciente
            if (cuentaEncontrada?.paciente) {
              const nombre = cuentaEncontrada.paciente.nombre || "";
              const apellido = cuentaEncontrada.paciente.apellido || "";
              const nombreCompletoStr = `${nombre} ${apellido}`.trim();
              if (nombreCompletoStr) {
                setNombreCompleto(nombreCompletoStr);
                return;
              }
            }
          }
        } catch (error) {
          console.error("Error obteniendo nombre del paciente:", error);
        }
      } else {
        // Para empleados, obtener desde getMyInfo
        try {
          const res = await getMyInfo();
          const userData = res?.data || res?.responseObject || res;
          const areaEmpleadoId = userData?.areaEmpleado?.id || 
                                 userData?.empleado?.id || 
                                 userData?.idEmpleado;

          if (areaEmpleadoId) {
            const areaRes = await getAreaEmpleadoById(Number(areaEmpleadoId));
            const empleado = areaRes?.responseObject || areaRes?.data || areaRes;
            
            if (empleado?.empleado) {
              const nombre = empleado.empleado.nombre || "";
              const apellido = empleado.empleado.apellido || "";
              const nombreCompletoStr = `${nombre} ${apellido}`.trim();
              if (nombreCompletoStr) {
                setNombreCompleto(nombreCompletoStr);
                return;
              }
            }
          }
        } catch (error) {
          console.error("Error obteniendo nombre del empleado:", error);
        }
      }
      
      // Fallback: usar el nombre del userInfo
      if (userInfo?.name) {
        setNombreCompleto(userInfo.name);
      } else if (userInfo?.username) {
        setNombreCompleto(userInfo.username);
      }
    };

    if (userToken) {
      loadNombreCompleto();
    }
  }, [userToken, isPaciente]);
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        color: themeSidebar.palette.text.primary,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 4,
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{ color: "white" }}
            aria-label="open drawer"
            edge="start"
            onClick={() => handleDrawerToggle()}
          >
            <MenuOutlined />
          </IconButton>

          <Box
            sx={{
              p: 0,
              color: "inherit",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "1rem",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <SwitchTheme
                changeMode={changeMode}
                isDarkMode={theme === "light" ? false : true}
                colorCustom="white"
              />
            </Box>
            <Box
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
                color: "inherit",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: "1rem",
              }}
            >
              <Typography color="white">
                {nombreCompleto || userInfo?.name || userInfo?.username || "-"}
              </Typography>
              <Avatar
                alt={nombreCompleto || userInfo?.name || userInfo?.username || "Usuario"}
                src={userInfo?.profile ? `${apiUrl}${userInfo?.profile}` : ""}
              />
            </Box>
          </Box>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {userToken && (
              <>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseUserMenu();
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Mi perfil</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Cerrar Sesión</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
