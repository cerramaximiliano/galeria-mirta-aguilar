import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Elimina console.log/debug del build de producción (console.error se conserva)
    pure: ['console.log', 'console.debug', 'console.info'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['mirtaaguilar.art', 'www.mirtaaguilar.art', 'localhost']
  }
})
