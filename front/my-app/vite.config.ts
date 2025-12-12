import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

const REPO_NAME = 'FrontendElements';
const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined;

export default defineConfig({
  base: isTauri ? '/' : `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FrontendElements',
        short_name: 'Elements',
        start_url: `/${REPO_NAME}/`,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    mkcert(),
  ],
  server: {
    port: 3000,
    https: {
      // пустой объект, Vite + mkcert сами подставят key/cert
    } as any,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/staticimages': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
});
