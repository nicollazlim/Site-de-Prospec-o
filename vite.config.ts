import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/brasilapi': {
          target: 'https://brasilapi.com.br/api/cnpj/v1',
          changeOrigin: true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          rewrite: (path) => path.replace(/^\/api\/brasilapi/, ''),
        },
        '/api/cep': {
          target: 'https://brasilapi.com.br/api/cep/v2',
          changeOrigin: true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          rewrite: (path) => path.replace(/^\/api\/cep/, ''),
        },
        '/api/nominatim': {
          target: 'https://nominatim.openstreetmap.org',
          changeOrigin: true,
          headers: {
            'User-Agent': 'ProspecForB2B/1.0 (contact@prospecfor.com)',
            'Accept': 'application/json',
          },
          rewrite: (path) => path.replace(/^\/api\/nominatim/, ''),
        },
        '/api/minhareceita': {
          target: 'https://minhareceita.org',
          changeOrigin: true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          rewrite: (path) => path.replace(/^\/api\/minhareceita/, ''),
        },
        '/api/receitaws': {
          target: 'https://receitaws.com.br/v1/cnpj',
          changeOrigin: true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          rewrite: (path) => path.replace(/^\/api\/receitaws/, ''),
        },
        '/api/publicacnpj': {
          target: 'https://publica.cnpj.ws/cnpj',
          changeOrigin: true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
          rewrite: (path) => path.replace(/^\/api\/publicacnpj/, ''),
        },
      },
    },
  };
});
