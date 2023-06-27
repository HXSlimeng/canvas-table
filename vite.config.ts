import { defineConfig } from 'vite'
import { resolve } from 'path'
import libcss from 'vite-plugin-libcss'
// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [],
  build: {
    outDir: 'dist',
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, './src/main.ts'),
      name: 'lmh-table'
    },
    cssCodeSplit: true,
    sourcemap: true
  },
  css: {

  },
  plugins: [
    libcss(
      {}
    )
  ]
})
