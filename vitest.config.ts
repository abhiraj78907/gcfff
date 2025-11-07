import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@patient": path.resolve(__dirname, "./apps/health-buddy-vibe/src"),
      "@doctor": path.resolve(__dirname, "./apps/doclens-ai-assist/src"),
      "@seva": path.resolve(__dirname, "./apps/seva-gate-dash/src"),
      "@shared": path.resolve(__dirname, "./src"),
    },
  },
});

