/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },

  staticDirs: ['../static'],

  async viteFinal(config) {
    config.server.fs.allow = ['../']

    Object.assign(config.define, {
      'process.browser': true,
      'globalThis.fetch': `((() => {
        const fetch = window.fetch
        return (...args) => (window.fetch.polyfill ? window.fetch : fetch)(...args)
      })())`,
    })

    config.optimizeDeps.exclude = ['webkit', 'san-webkit']

    return config
  },
}

export default config
