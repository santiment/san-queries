import adapter from '@sveltejs/adapter-node'
import webkitConfig from 'san-webkit/svelte.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  ...webkitConfig,

  kit: {
    adapter: adapter(),
    alias: {
      '$routes/*': './src/routes/*',
      '$static/*': './static/*',
    },
  },
}

export default config
