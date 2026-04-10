import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL for Electron to find assets
  build: {
    outDir: 'dist_web', // Separating from electron's dist
    emptyOutDir: true
  },
  server: {
    port: 5000
  }
})
