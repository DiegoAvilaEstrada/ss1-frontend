import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: Dispatch<SetStateAction<"light" | "dark">>;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});
