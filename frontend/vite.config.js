import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      devOptions: {
        enabled: true // This allows you to test "Install" on localhost!
      },
      manifest: {
        name: 'PulseGuard AI Monitor', // Professional Name
        short_name: 'PulseGuard',
        description: 'Real-time AI Health Monitoring System',
        theme_color: '#2563eb', // Medical Blue
        background_color: '#ffffff',
        display: 'standalone', // <--- THE MAGIC LINE (Removes Browser Bar)
        orientation: 'portrait', // Locks mobile view
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Ensures icon looks good on Android
          }
        ]
      }
    })
  ],
})