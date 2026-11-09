import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wishesApiPlugin } from './src/server/wishesApiPlugin';
import { teachersApiPlugin } from './src/server/teachersApiPlugin';

export default defineConfig({
  plugins: [react(), wishesApiPlugin(), teachersApiPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});

