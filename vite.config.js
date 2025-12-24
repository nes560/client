import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,          // Sesuaikan dengan port Railway
    allowedHosts: true,  // IZINKAN semua domain (Solusi Error Blocked Request)
    host: true           // Buka akses network (0.0.0.0)
  },
  server: {
    port: 3000,          // Opsional: Samakan port saat mode develop
  }
})