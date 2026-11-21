import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project path. Pages are prerendered by scripts/prerender.js after the build.
  base: '/datadog-certification-unofficial-mockexam/'
})
