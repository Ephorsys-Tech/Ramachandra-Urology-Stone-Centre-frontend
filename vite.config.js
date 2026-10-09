import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-icons")) return "vendor-icons";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("react-redux") ||
              id.includes("@reduxjs")
            ) {
              return "vendor-react-core";
            }
          }
        },
      },
    },
  },
});

