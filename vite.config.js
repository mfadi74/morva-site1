import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base './' so the build works both at a domain root and under
// a sub-path like https://<user>.github.io/morva-site1/
export default defineConfig({
  base: "./",
  plugins: [react()],
});
