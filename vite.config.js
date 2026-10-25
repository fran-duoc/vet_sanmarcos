import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Nos permite usar describe, it y expect sin importarlos en cada archivo
    environment: 'jsdom', // Usa el navegador invisible que instalamos
    setupFiles: './src/setupTests.js', // Archivo de configuración inicial
  }
})
