import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// base './' so the built files work from any folder or artifact link
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url))
    }
  },
  build: { outDir: 'dist', assetsDir: 'assets', sourcemap: false }
});
