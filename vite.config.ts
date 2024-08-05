import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import mkcert from 'vite-plugin-mkcert'
import { execSync } from 'node:child_process'
import { createRequire } from 'module'
import { WebkitSvg } from 'san-webkit-next/plugins/vite.js'

globalThis.require = createRequire(import.meta.url)

const mode = process.env.NODE_ENV
const dev = mode !== 'production'

const BACKEND_URL = process.env.BACKEND_URL || 'https://api-stage.santiment.net'
const GQL_SERVER_FALLBACK = BACKEND_URL + '/graphql'

const IS_STAGE_BACKEND = BACKEND_URL.includes('-stage')
const IS_PROD_BACKEND = !IS_STAGE_BACKEND

const GIT_HEAD =
  process.env.GIT_HEAD || execSync('git rev-parse HEAD').toString().trim().slice(0, 7)

export default defineConfig({
  plugins: [
    process.argv.includes('--https') && mkcert({ savePath: './mkcert' }),
    sveltekit(),
    WebkitSvg(),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },

  server: {
    port: 3000,
  },

  define: {
    'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"',
    'process.env.IS_DEV_MODE': dev,
    'process.env.IS_PROD_MODE': !dev,

    'process.env.MEDIA_PATH': JSON.stringify('/webkit'),
    'process.env.ICONS_PATH': JSON.stringify('/webkit/icons'),

    'process.env.BACKEND_URL': JSON.stringify(BACKEND_URL),
    'process.env.GQL_SERVER_URL': JSON.stringify(GQL_SERVER_FALLBACK),
    'process.env.NODE_GQL_SERVER_URL': JSON.stringify(process.env.NODE_GQL_SERVER_URL),

    'process.env.IS_STAGE_BACKEND': IS_STAGE_BACKEND,
    'process.env.IS_PROD_BACKEND': IS_PROD_BACKEND,

    'process.env.API_FETCH_ORIGIN': JSON.stringify('https://app.santiment.net'),

    'process.env.GIT_HEAD': JSON.stringify(GIT_HEAD),
    'process.env.VERSION': JSON.stringify('2.5-' + GIT_HEAD),
  },
})
