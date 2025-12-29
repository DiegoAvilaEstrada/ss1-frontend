import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import type { FC } from "react";

interface ModeButtonProps {
  isDarkMode: boolean;
  changeMode: () => void;
  colorCustom?: string;
}

export const SwitchTheme: FC<ModeButtonProps> = ({
  isDarkMode,
  changeMode,
  colorCustom = "",
}) => {
  return (
    <IconButton
      onClick={changeMode}
      sx={{
        color: colorCustom ? colorCustom : isDarkMode ? "#E67C52" : "#4a7c59",
        transition: "0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(230,124,82,0.15)",
        },
      }}
    >
      {isDarkMode ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};
