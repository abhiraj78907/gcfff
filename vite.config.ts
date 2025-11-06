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
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "@patient", replacement: path.resolve(__dirname, "./apps/health-buddy-vibe/src") },
      { find: "@seva", replacement: path.resolve(__dirname, "./apps/seva-gate-dash/src") },
      { find: "@admin", replacement: path.resolve(__dirname, "./apps/medichain-nexus-suite/src") },
      { find: "@welcome", replacement: path.resolve(__dirname, "./apps/medichain-sparkle-onboard/src") },
      { find: "@gate", replacement: path.resolve(__dirname, "./apps/health-chain-gate/src") },
      { find: "@doctor", replacement: path.resolve(__dirname, "./apps/doclens-ai-assist/src") },
      { find: "@shared", replacement: path.resolve(__dirname, "./src") },
    ],
  },
}));
