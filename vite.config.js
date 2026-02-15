import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// NOTE: vite-plugin-pwa is installed but disabled during local dev
// because the apostrophe in the project path ("Mama's Birthday") breaks
// workbox's service worker generation. Enable when deploying from a
// clean path or CI.

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ]
})
