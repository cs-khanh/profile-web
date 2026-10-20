import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        research: 'research/index.html',
        publications: 'publications/index.html',
        projects: 'projects/index.html',
        profile: 'profile/index.html',
      },
    },
  },
});
