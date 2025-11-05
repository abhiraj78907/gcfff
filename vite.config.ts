import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@patient": path.resolve(__dirname, "./apps/health-buddy-vibe/src"),
      "@seva": path.resolve(__dirname, "./apps/seva-gate-dash/src"),
      "@admin": path.resolve(__dirname, "./apps/medichain-nexus-suite/src"),
      "@welcome": path.resolve(__dirname, "./apps/medichain-sparkle-onboard/src"),
      "@gate": path.resolve(__dirname, "./apps/health-chain-gate/src"),
          "@doctor": path.resolve(__dirname, "./apps/doclens-ai-assist/src"),
    },
  },
}));
