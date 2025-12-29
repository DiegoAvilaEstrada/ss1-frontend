import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@notProtected": path.resolve(__dirname, "src/pages/notProtected/"),
      "@utilities": path.resolve(__dirname, "src/utilities/"),
      "@routes": path.resolve(__dirname, "src/routes/"),
      "@services": path.resolve(__dirname, "src/services/"),
      "@redux": path.resolve(__dirname, "src/redux/"),
    },
  },
  base: "/",
  publicDir: "./src/assets",
});
