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
  define: {
    'import.meta.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3200/api')
  }
})