import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const rootSrc = path.resolve(__dirname, "../../src");
  
  return {
  server: {
    host: "::",
    port: 8080,
      hmr: {
        overlay: true,
      },
  },
  plugins: [react()],
  resolve: {
      alias: [
        { find: /^@$/, replacement: path.resolve(__dirname, "./src") },
        { find: /^@admin$/, replacement: path.resolve(__dirname, "./src") },
        { find: /^@admin\/(.*)$/, replacement: path.join(__dirname, "./src", "$1") },
        { find: /^@shared\/(.*)$/, replacement: path.join(rootSrc, "$1") },
      ],
    },
  };
});
