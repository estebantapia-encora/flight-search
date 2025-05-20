import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  // proxy only needed in dev mode, but nginx handles it in production
})
