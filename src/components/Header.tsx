import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Drawer,
  ListItemButton,
  List,
  ListItemText,
} from "@mui/material";
import { SwitchTheme } from "./Layout/SwitchTheme";
import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../contexts/theme-context";
import ThemeApp from "../styles/theme-app";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";
import type { MarginProps } from "@utilities/types/MarginProps";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ margin }: { margin: MarginProps }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const navigate = useNavigate();
  const changeMode = () => {
    const current = theme === "dark" ? "light" : "dark";
    setTheme(current);
    localStorage.setItem("dark-mode", current);
    ThemeApp(current);
  };

  const themeMui = ThemeApp(theme);
  const toggleDrawer = () => setOpen(!open);

  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(sectionId);
      }
    } else {
      navigate("/", { state: { scrollToSection: sectionId } });
    }
  };
  const isActive = (id: string) => active === id;
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  const handleLogoClicks = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          navigate("/");
        }
        clickCountRef.current = 0;
      }, 400);
    }

    if (clickCountRef.current === 3) {
      clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      navigate("/login");
    }
  };
  return (
    <>
      <AppBar
        enableColorOnDark
        sx={{
          backgroundColor: alpha(themeMui.palette.background.paper, 0.75),
          backdropFilter: "blur(8px)",
          color: themeMui.palette.text.primary,
        }}
        position="sticky"
        elevation={3}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 3,
            px: margin,
            borderBottom: `0.5px solid ${alpha(
              themeMui.palette.text.primary,
              0.00005
            )}`,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            onClick={handleLogoClicks}
            sx={{ cursor: "pointer" }}
          >
            <img src="/logo.png" alt="Logo" style={{ width: 60, height: 60 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }} color="primary">
                PsiFirm
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={4}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              mx: "auto",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            <Button
              color="primary"
              sx={{
                textTransform: "none",
                borderBottom: isActive("valores")
                  ? "2px solid"
                  : "2px solid transparent",
                borderColor: isActive("valores")
                  ? themeMui.palette.primary.main
                  : "transparent",
                borderRadius: 0,
              }}
              onClick={() => scrollToSection("valores")}
            >
              Valores
            </Button>
            <Button
              color="primary"
              sx={{
              textTransform: "none",
              borderBottom: isActive("inicio")
                ? "2px solid"
                : "2px solid transparent",
              borderColor: isActive("inicio")
                ? themeMui.palette.primary.main
                : "transparent",
              borderRadius: 0,
              }}
              onClick={() => scrollToSection("inicio")}
            >
              Iniciar sesión
            </Button>
          </Stack>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
              display: {
                xs: "none",
                md: "inline-flex",
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "1rem",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={() => scrollToSection("contacto")}
            >
              Contacto
            </Button>
          </Box>
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 250,
            backgroundColor: "background.default",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            py: 2,
          }}
        >
          <Box display="flex" justifyContent="flex-end" px={2}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <ListItemButton
              onClick={() => {
                scrollToSection("mision");
                toggleDrawer();
              }}
            >
              <ListItemText
                sx={{
                  borderBottom: isActive("mision")
                    ? "2px solid"
                    : "2px solid transparent",
                  borderColor: isActive("mision")
                    ? themeMui.palette.primary.main
                    : "transparent",
                }}
                primary="Mision y vision"
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                scrollToSection("valores");
                toggleDrawer();
              }}
            >
              <ListItemText
                sx={{
                  borderBottom: isActive("valores")
                    ? "2px solid"
                    : "2px solid transparent",
                  borderColor: isActive("valores")
                    ? themeMui.palette.primary.main
                    : "transparent",
                }}
                primary="Valores"
              />
            </ListItemButton>
            <ListItemButton>
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ borderRadius: "0.7rem", textTransform: "none" }}
              >
                Contacto
              </Button>
            </ListItemButton>
            <ListItemButton>
              <SwitchTheme
                changeMode={changeMode}
                isDarkMode={theme === "dark"}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
