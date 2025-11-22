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
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: [],
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core - MUST include scheduler for proper React hooks
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }
          // Charts
          if (id.includes('node_modules/recharts')) {
            return 'chart-vendor';
          }
          // TanStack Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query-vendor';
          }
          // Form libraries
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform')) {
            return 'form-vendor';
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icon-vendor';
          }
          // Router
          if (id.includes('node_modules/wouter')) {
            return 'router-vendor';
          }
          // Other large dependencies
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
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
      process.env.VITE_API_URL || ''
    ),
  },
})