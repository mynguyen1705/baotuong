import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wishesApiPlugin } from './src/server/wishesApiPlugin';
import { teachersApiPlugin } from './src/server/teachersApiPlugin';
import { memoriesApiPlugin } from './src/server/memoriesApiPlugin';

export default defineConfig({
  plugins: [react(), wishesApiPlugin(), teachersApiPlugin(), memoriesApiPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});

