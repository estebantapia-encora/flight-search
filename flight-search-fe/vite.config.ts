import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // proxy only needed in dev mode, but nginx handles it in production
})
