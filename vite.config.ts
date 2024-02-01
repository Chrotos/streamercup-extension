import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue'
import zipPack from "vite-plugin-zip-pack";
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
    zipPack({
      inDir: resolve(__dirname, 'dist'),
      outDir: resolve(__dirname),
      outFileName: 'dist.zip',
      filter(fileName, filePath, isDirectory) {
          return !fileName.endsWith('.psd')
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: false,
    rollupOptions: {
      input: [
        resolve(__dirname, 'video_component.html')
      ]
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  }
})
