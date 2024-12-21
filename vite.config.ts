import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
/*
Find out here why change from legacy to modern: https://vite.dev/config/shared-options.html#css-preprocessoroptions
*/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        importers: [
          // ...
        ],
      },
    },
  },
});
