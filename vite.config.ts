import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    assetsInlineLimit: 1,
  },
  server: {
    port: 3020,
  },
  plugins: [Vue()],
})
