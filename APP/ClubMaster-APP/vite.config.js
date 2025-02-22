import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3200',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    'import.meta.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
    'process.env': {
      WEBSOCKET_URL: JSON.stringify(process.env.WEBSOCKET_URL || 'ws://localhost:3200'),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  },
})