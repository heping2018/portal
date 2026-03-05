import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        // Proxy all requests starting with /api to the target URL
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true, // Needed for virtual hosted sites
          // The rewrite rule has been removed to ensure the /api prefix is forwarded to the backend.
        },
      },
    },
  };
});
