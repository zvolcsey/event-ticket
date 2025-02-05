import { defineConfig, preprocessCSS } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.DOCKER === 'true' ? '0.0.0.0' : 'localhost',
  },
})
