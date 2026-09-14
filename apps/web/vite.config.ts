import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from both apps/web and repository root directory
  const rootDir = path.resolve(__dirname, '../..');
  const rootEnv = loadEnv(mode, rootDir, ['VITE_', 'BACKEND_', 'API_']);
  const localEnv = loadEnv(mode, __dirname, ['VITE_', 'BACKEND_', 'API_']);
  const mergedEnv = { ...rootEnv, ...localEnv, ...process.env };

  const resolvedApiUrl = mergedEnv.VITE_API_URL || mergedEnv.BACKEND_URL || mergedEnv.API_URL || '';
  const resolvedSocketUrl = mergedEnv.VITE_SOCKET_URL || mergedEnv.SOCKET_URL || '';

  return {
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(resolvedApiUrl),
      'import.meta.env.VITE_SOCKET_URL': JSON.stringify(resolvedSocketUrl),
    },
    resolve: {
      alias: {
        canvg: path.resolve(__dirname, './src/shims/canvg.ts'),
      },
    },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'CproHub — Construction OS',
        short_name: 'CproHub',
        description: 'Projects, BOQs, workforce, payroll, tenders and AI — the construction operating system.',
        theme_color: '#001529',
        background_color: '#001529',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell; API calls (cross-origin :5050) stay network-only.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/health/],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      // Keep the service worker OFF during dev so it never serves stale code.
      devOptions: { enabled: false },
    }),
  ],
};
});
