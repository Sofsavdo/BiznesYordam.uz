import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath, URL } from 'node:url'

// ESM compatible __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Dev plugins array
const devPlugins = []

if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
  try {
    const runtimeErrorOverlay = require("@replit/vite-plugin-runtime-error-modal").default
    const { cartographer } = require("@replit/vite-plugin-cartographer")

    devPlugins.push(runtimeErrorOverlay())
    devPlugins.push(cartographer())
  } catch (e) {
    console.warn("⚠️ Replit plugins not found, skipping...")
  }
}

export default defineConfig({
  plugins: [
    react(),
    ...devPlugins,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 8080,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
})