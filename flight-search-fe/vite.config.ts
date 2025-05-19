import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8080', // service name from docker-compose
        changeOrigin: true,
        secure: false,
      },
    },
    port: 5173,
  },
  plugins: [react()],
})
