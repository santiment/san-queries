import { createRequire } from 'node:module'
import { mergeConfig } from 'vite'
import {
  createConfig,
  IS_DEV_MODE,
  BACKEND_URL,
  GQL_SERVER_URL,
  IS_PROD_BACKEND,
} from 'san-webkit-next/vite.config.js'
import { VERSION } from './version.js'

global.require = createRequire(import.meta.url)

process.env.MEDIA_PATH = '/webkit'
process.env.ICONS_PATH = process.env.MEDIA_PATH + '/icons'

console.log('VERSION -> ', JSON.stringify(VERSION))
console.log('BACKEND_URL -> ', JSON.stringify(BACKEND_URL))
console.log('GQL_SERVER_URL -> ', JSON.stringify(GQL_SERVER_URL))
console.log('IS_PROD_MODE -> ', !IS_DEV_MODE)
console.log('IS_PROD_BACKEND -> ', IS_PROD_BACKEND)

const config = mergeConfig(
  createConfig({
    corsOrigin: process.env.NODE_GQL_SERVER_URL,
  }),
  {
    clientDefines: {
      'process.browser': true,
    },

    serverDefines: {
      'process.env.GQL_SERVER_URL': JSON.stringify(
        process.env.NODE_GQL_SERVER_URL || GQL_SERVER_URL,
      ),
    },

    optimizeDeps: {
      exclude: ['canvas'],
    },

    ssr: {
      noExternal: [
        '@santiment-network/chart',
        'chart.js',
        'Sanbase',
        'san-queries',
        // 'san-studio'
      ],
    },

    define: {
      'process.browser': false,

      'process.env.MEDIA_PATH': JSON.stringify(process.env.MEDIA_PATH),
      'process.env.ICONS_PATH': JSON.stringify(process.env.ICONS_PATH),

      'process.env.API_FETCH_ORIGIN': JSON.stringify('https://app.santiment.net'),
      'process.env.SANBASE_ORIGIN': JSON.stringify('https://app.santiment.net'),

      'process.env.VERSION': JSON.stringify(VERSION),
    },
  },
)

export default config
