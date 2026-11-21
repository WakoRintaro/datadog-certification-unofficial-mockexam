import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seoUpdates from './scripts/seo-updates-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoUpdates()],
  base: '/datadog-certification-unofficial-mockexam'
})
