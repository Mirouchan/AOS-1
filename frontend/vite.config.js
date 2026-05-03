import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // needed for Docker
    watch: {
      usePolling: true,   // ✅ force polling (works on Windows)
      interval: 1000,     // check every second
    },
  },
});