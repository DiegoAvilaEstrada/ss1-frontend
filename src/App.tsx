import { lazy, Suspense, useState } from "react";
import { ThemeContext } from "./contexts/theme-context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import ThemeApp from "./styles/theme-app";
import { AuthRoutesRender } from "@routes/auth.routes";
import { AlertProvider } from "@components/Alerts";
import AppLayout from "@components/Layout/AppLayout";
import { ProtectedRoute } from "@utilities/ProtectedRoute";
import { DashboardRenderRoutes } from "@routes/dashboard.routes";
import { PsiFirmRoutesRender } from "@routes/psifirm.routes";

const Home = lazy(() => import("./pages/notProtected/Home"));
const LoadingPage = lazy(() => import("./components/Shared/LoadingPage"));
const NotFound = lazy(() => import("./components/Shared/NotFoundPage"));

function App() {
  const isBrowserDefaultDark = (): boolean => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };

  const getDefaultTheme = (): "light" | "dark" => {
    if (typeof localStorage !== "undefined") {
      const localStorageTheme = localStorage.getItem("dark-mode");
      if (localStorageTheme === "light" || localStorageTheme === "dark") {
        return localStorageTheme;
      }
    }
    return isBrowserDefaultDark() ? "dark" : "light";
  };
  const [theme, setTheme] = useState(getDefaultTheme());
  const muiTheme = ThemeApp(theme);
  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <AlertProvider>
            <div
              style={{
                minHeight: "100vh",
                width: "100%",
              }}
            >
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  {AuthRoutesRender()}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                      {DashboardRenderRoutes()}
                      {PsiFirmRoutesRender()}
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </AlertProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
