import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Add this 'server' section
  server: {
    proxy: {
      '/api': { // Catches all requests starting with /api
        target: 'http://localhost:8080', // Forwards them to your Java server
        changeOrigin: true, // Important for CORS
      }
    }
  }
})