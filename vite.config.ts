import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    splitVendorChunkPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: false
  },
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  }
})
