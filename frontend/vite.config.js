import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/compat/test-utils',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  },
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
});
