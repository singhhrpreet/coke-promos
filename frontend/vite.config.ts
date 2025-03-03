import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL)
    },
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: '../backend/public',
      emptyOutDir: false, // also necessary
    }
  }
});
