import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from "vite-plugin-compression"
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
  // mkcert(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024,
      verbose: true,
    }),
  ],
  build: {
    target: 'esnext',
  },
})