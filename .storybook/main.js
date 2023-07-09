/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
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
    })

    config.optimizeDeps.exclude = ['san-webkit']

    return config
  },
}

export default config
