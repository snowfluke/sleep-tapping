import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base so the same build works at the GitHub Pages root and under /pull/<n>/ previews.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
