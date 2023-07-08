import type { Preview } from '@storybook/svelte'

import '../static/webkit/styles/main.css'
import Decorator from './Decorator.svelte'

const preview: Preview = {
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
