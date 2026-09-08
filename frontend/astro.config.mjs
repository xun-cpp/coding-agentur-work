import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://reference.example.invalid',
  output: 'static',
  outDir: '../www',
  integrations: [react()],
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
  },
});
