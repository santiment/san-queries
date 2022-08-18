import { resolve } from 'path'
import { defineConfig } from 'vite'
import TsChecker from 'vite-plugin-ts-checker'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const isDev = process.env.NODE_ENV !== 'production'
process.env.GQL_SERVER_URL = 'https://api-stage.santiment.net/graphql'
process.env.IS_DEV_MODE = isDev

const webkitPath = isDev ? '/node_modules/san-webkit/lib' : '/webkit'

process.env.MEDIA_PATH = webkitPath
process.env.ICONS_PATH = webkitPath + '/icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TsChecker(), svelte()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src',
      },

      {
        find: 'san-chart',
        replacement: '/node_modules/@santiment-network/chart/',
      },
      { find: 'webkit', replacement: '/node_modules/san-webkit/lib/' },
      { find: 'studio', replacement: '/node_modules/san-studio/lib/' },

      { find: 'svelte', replacement: '/node_modules/svelte/' },
      { find: 'san-webkit', replacement: '/node_modules/san-webkit/' },
    ],
  },
  define: {
    'process.browser': true,

    'process.env.GQL_SERVER_URL': JSON.stringify(process.env.GQL_SERVER_URL),
    'process.env.MEDIA_PATH': JSON.stringify(process.env.MEDIA_PATH),
    'process.env.ICONS_PATH': JSON.stringify(process.env.ICONS_PATH),
    'process.env.IS_DEV_MODE': JSON.stringify(process.env.IS_DEV_MODE),

    'process.env': isDev ? process.env : {},
  },
  optimizeDeps: {
    exclude: [
      'svelte',
      'webkit',
      'san-webkit',
      'studio',
      'san-studio',
      'canvas',
      'node-fetch',
      'mathjs',
    ],
  },

  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, '..', 'index.html'),
      },
      output: {
        manualChunks: {
          monaco: ['monaco-editor'],
        },
      },
    },
  },
})
