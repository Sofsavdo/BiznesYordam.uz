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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
        },
      },
    },
  },
  server: {
    port: 5000,
    strictPort: false,
    host: "0.0.0.0",
    hmr: false, // Disable HMR in Replit environment to avoid WebSocket issues
    watch: {
      usePolling: true, // Better for container/remote environments
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    allowedHosts: true,
  },
  define: {
    // Environment variable'larni client'ga o'tkazamiz
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://biznesyordam-backend.onrender.com'
    ),
  },
})