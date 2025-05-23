import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to avoid CORS issues
      '/api': {
        target: 'https://begdulla.uz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/APII'),
        secure: false,
      }
    }
  }
})
