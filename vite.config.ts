import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

const aliases = [
  { find: 'san-webkit', replacement: '/node_modules/san-webkit/' },
  { find: 'san-studio', replacement: '/node_modules/san-studio/' },
]

export default defineConfig({
  plugins: [sveltekit()],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },

  server: {
    port: 3000,
  },

  resolve: {
    alias: [
      { find: 'webkit', replacement: '/node_modules/san-webkit/lib/' },
      { find: 'studio', replacement: '/node_modules/san-studio/lib/' },
    ].concat(aliases),
  },

  define: {
    'process.env.NODE_ENV':
      process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'san-webkit/lib/styles/fn.scss';`,
      },
    },
  },
})
