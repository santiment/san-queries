const sveltePreprocess = require('svelte-preprocess')
const cssModules = require('svelte-preprocess-cssmodules')

const BABEL_PREPROCESS = {
  assumptions: { noDocumentAll: true },
  plugins: ['@babel/plugin-proposal-optional-chaining'],
}

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [cssModules(), sveltePreprocess({ babel: BABEL_PREPROCESS })],
}
