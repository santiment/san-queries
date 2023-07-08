import '../static/webkit/styles/main.css'
import Decorator from './Decorator.svelte'

/** @type {import('@storybook/svelte').Preview} */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [(_, { args }) => ({ Component: Decorator, props: args })],
}

export default preview
