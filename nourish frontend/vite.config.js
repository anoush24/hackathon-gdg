import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // This will proxy any request starting with /api
      // to your backend server.
      '/api': {
        target: 'http://localhost:5000', // Your Node.js backend address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Can be false for http target
      },
    },
  },
})
