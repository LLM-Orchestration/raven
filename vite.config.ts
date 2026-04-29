import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.PUBLIC_BASE_PATH || '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Raven',
        short_name: 'Raven',
        description: 'Tool building for Agentic LLMs',
        theme_color: '#000000',
        icons: [
          // Icons will be added when available
        ]
      }
    })
  ]
});
