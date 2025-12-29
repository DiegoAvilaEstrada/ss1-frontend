import { Box, Drawer } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../../contexts/theme-context";
import Header from "./Header";
import SideBar from "./SideBar";
import { getRole } from "@utilities/Functions";
import { Home } from "@mui/icons-material";
import { getMenu } from "@utilities/Menu";

interface AppLayoutProps {
  window?: () => Window;
}

const AppLayout = ({ window }: AppLayoutProps) => {
  const [drawerWidth, setDrawerWidth] = useState(250);
  const [mobileOpen, setMobileOpen] = useState(true);
  const { theme } = useContext(ThemeContext);
  const handleSidebarToggle = () => {
    setShowLargeSideBar(!showLargeSideBar);
    showLargeSideBar ? setDrawerWidth(0) : setDrawerWidth(250);
  };
  const handleDrawerToggle = () => {
    mobileOpen ? setDrawerWidth(0) : setDrawerWidth(250);
    setMobileOpen(!mobileOpen);
    setShowLargeSideBar(!mobileOpen);
  };
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [showLargeSideBar, setShowLargeSideBar] = useState(true);
  const itemsMenu = getMenu(getRole() || "");
  const items = [
    {
      title: "Inicio",
      icon: <Home />,
      path: "/home",
    },
    ...itemsMenu,
  ];

  return (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "flex",
            md: "flex",
            lg: "flex",
            xl: "flex",
          },
        }}
      >
        <CssBaseline />
        <Header
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="nav"
          sx={{
            width: showLargeSideBar ? drawerWidth : 0,
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
          aria-label="sidebar"
        >
          <Drawer
            container={container}
            variant="temporary"
            className={`contenedor-sidebar ${theme}`}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true, disableScrollLock: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: "none",
              },
            }}
          >
            <SideBar
              items={items}
              handleSidebarToggle={() => setShowLargeSideBar(!showLargeSideBar)}
              showLargeSideBar={showLargeSideBar}
            />
          </Drawer>

          <Drawer
            variant="permanent"
            className={`contenedor-sidebar ${theme}`}
            sx={{
              display: { xs: "none", sm: "block" },
              width: drawerWidth,
              transition: "width 0.3s ease",
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                overflowX: "hidden",
                transition: "width 0.3s ease",
                borderRight: "none",
                margin: 0,
                padding: 0,
              },
            }}
            open
          >
            <SideBar
              items={items}
              showLargeSideBar={showLargeSideBar}
              handleSidebarToggle={handleSidebarToggle}
            />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            transition: "width 0.3s ease",
            backgroundColor: "backgroundApp.main",
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};
export default AppLayout;
