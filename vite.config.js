import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase dans son propre chunk
          if (id.includes('firebase')) return 'firebase';
          // Recharts dans son propre chunk
          if (id.includes('recharts')) return 'recharts';
          // Lucide dans son propre chunk
          if (id.includes('lucide-react')) return 'lucide';
        },
      },
    },
  },
});