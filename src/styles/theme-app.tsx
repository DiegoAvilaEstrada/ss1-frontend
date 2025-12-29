import { createTheme, type Theme } from "@mui/material/styles";

const ThemeApp = (darkMode: string): Theme => {
  const mode = darkMode === "light" || darkMode === "dark" ? darkMode : "light";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: mode === "light" ? "#1F3A5F" : "#4F6D8C", 
        dark: "#162B45",
        light: "#6F8FAF",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: mode === "light" ? "#2F7D6B" : "#5FAF9E", 
        dark: "#1E5A4D",
        light: "#8FD3C4",
        contrastText: "#FFFFFF",
      },

      success: {
        main: mode === "light" ? "#3FA37C" : "#6BC7A2",
      },

      error: {
        main: mode === "light" ? "#C94A4A" : "#E57373",
      },

      warning: {
        main: mode === "light" ? "#D4A24C" : "#F0C987",
      },

      info: {
        main: mode === "light" ? "#4A78C2" : "#7BA0E0",
      },

      background: {
        default: mode === "light" ? "#F5F7FA" : "#121821",
        paper: mode === "light" ? "#FFFFFF" : "#1A2230",
      },
    },

    typography: {
      fontFamily: `"Inter", "Roboto", "Helvetica", sans-serif`,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },

    shape: {
      borderRadius: 12,
    },
  });
};

export default ThemeApp;
