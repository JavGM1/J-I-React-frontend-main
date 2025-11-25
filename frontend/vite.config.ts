import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.94.172.177:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
