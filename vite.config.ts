import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdown from './plugins/vite-plugin-markdown'
import contentImages from './plugins/vite-plugin-content-images'
import { resolve } from 'path'
import { mkdirSync, writeFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    react(),
    markdown(),
    contentImages(),
    {
      name: 'github-pages-postbuild',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        try {
          mkdirSync(outDir, { recursive: true })
          writeFileSync(resolve(outDir, '.nojekyll'), '')
        } catch {
          // Build output is not available during dev mode.
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content/zh': resolve(__dirname, 'content/zh'),
      '@content': resolve(__dirname, 'content'),
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
