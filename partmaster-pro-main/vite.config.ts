import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,   // Changed from 8080 — Spring Boot uses 8080
    hmr: {
      overlay: false,
    },
    proxy: {
      // Forward all /api requests to the Spring Boot backend
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path,   // keep /api prefix (backend expects it)
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
