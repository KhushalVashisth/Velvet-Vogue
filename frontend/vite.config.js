import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, 
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    rollupOptions: {
      external: ['react-router-dom', 'react-toastify','react-toastify/dist/ReactToastify.css','axios'], // ✅ Add react-toastify
    },
  },
});
