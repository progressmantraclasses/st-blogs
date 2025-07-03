import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window'  // Fix for Draft.js issue
  },
  base: "/",
  build: {
    outDir: "dist"
  },
  server: {
    historyApiFallback: true
  }
});
