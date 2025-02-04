import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  resolve: {
    alias: {
      "react-router-dom": "react-router-dom",
    },
  },
  build: {
    rollupOptions: {
      
      output: {
        globals: {
          'react-toastify': 'ReactToastify', // Declare global if using externalized module
        },
      },
    },
  },
});
