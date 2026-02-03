import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3100,
    allowedHosts: [
      'hireco.nadinata.org',
      'api-hireco.nadinata.org',
    ],
  }
})
