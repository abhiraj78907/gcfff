import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy Netlify functions to local server in dev mode
      '/.netlify/functions/whisper-transcribe': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => '/whisper-transcribe', // Rewrite to correct endpoint
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // Silently handle connection errors - will fall back to mock
            console.log('[Vite Proxy] Whisper server not available, will use mock fallback');
          });
        },
      },
    },
  },
  // Load env vars from project root
  envDir: ".",
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
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          ui: ["lucide-react"],
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/analytics",
          ],
          ai: [
            // leave empty if using serverless; this ensures client isn’t bundling model SDKs
          ],
        },
      },
    },
  },
}));
