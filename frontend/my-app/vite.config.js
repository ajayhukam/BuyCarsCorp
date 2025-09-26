import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS 'server' BLOCK
  server: {
    proxy: {
      // String shorthand: '/api' -> 'http://localhost:5000/api'
      // We use the object syntax for more options
      '/api': {
        target: 'http://localhost:5000', // Your backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Set to false if you're not using HTTPS
      }
    }
  }
})