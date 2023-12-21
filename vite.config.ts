import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

const mode = process.env.NODE_ENV
const dev = mode !== 'production'

process.env.MEDIA_PATH = '/webkit'
process.env.ICONS_PATH = process.env.MEDIA_PATH + '/icons'

// const BACKEND_URL = process.env.BACKEND_URL || 'https://api.santiment.net'

const BACKEND_URL = process.env.BACKEND_URL || 'https://api-stage.santiment.net'
process.env.BACKEND_URL = BACKEND_URL

const GQL_SERVER_FALLBACK = process.env.BACKEND_URL + '/graphql'

const IS_STAGE_BACKEND = process.env.BACKEND_URL.includes('-stage')
const IS_PROD_BACKEND = !IS_STAGE_BACKEND

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
    'process.browser': false,

    'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"',
    'process.env.IS_DEV_MODE': dev,
    'process.env.IS_PROD_MODE': !dev,

    'process.env.MEDIA_PATH': JSON.stringify(process.env.MEDIA_PATH),
    'process.env.ICONS_PATH': JSON.stringify(process.env.ICONS_PATH),

    'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    'process.env.GQL_SERVER_URL': JSON.stringify(GQL_SERVER_FALLBACK),

    'process.env.IS_STAGE_BACKEND': IS_STAGE_BACKEND,
    'process.env.IS_PROD_BACKEND': IS_PROD_BACKEND,

    'process.env.API_FETCH_ORIGIN': JSON.stringify('https://app.santiment.net'),
    'process.env.SANBASE_ORIGIN': JSON.stringify(''),
  },

  clientDefines: {
    'process.browser': true,
  },

  serverDefines: {
    'process.env.GQL_SERVER_URL': JSON.stringify(process.env.GQL_SERVER_URL || GQL_SERVER_FALLBACK),
  },
})
