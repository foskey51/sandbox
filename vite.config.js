import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from "vite-plugin-compression"

export default defineConfig({
  plugins: [
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