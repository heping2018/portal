import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy all requests starting with /api to the backend API server
      '/api': {
        target: 'https://unstruggling-remona-actionably.ngrok-free.dev', // The backend server
        changeOrigin: true,
        // No rewrite needed, as the backend itself expects the /api prefix
      },
    },
  },
});
