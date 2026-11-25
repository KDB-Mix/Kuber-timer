import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import process from "node:process";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({
  plugins: [react()],
  base: process.env.VITE_GH_PAGES === 'true' ? '/Kuber-timer/' : '/',
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || "127.0.0.1",
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  worker: { format: "es" },
  optimizeDeps: {
    exclude: ["cubing"],
  },
  build: {
    rolldownOptions: {
      resolve: {
        alias: {
          "cubing/scramble": path.resolve(
            import.meta.dirname,
            "node_modules/cubing/dist/lib/cubing/scramble/index.js"
          ),
        },
      },
    },
  },
}));   