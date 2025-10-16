import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5003,
    cors: true,
    allowedHosts: [
      'hireco.intelix.fun', // tambahkan domain kamu di sini
    ],
  }
})
