import { initialize, mswLoader } from 'msw-storybook-addon'
import '../static/webkit/styles/main.css'
import { Cache } from 'webkit/api/cache'
import Decorator from './Decorator.svelte'
import { ApiMock } from './mock'

// Initialize MSW
initialize()

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

  loaders: [
    (context) => {
      const {
        parameters: { mockApi, msw },
      } = context

      Cache.forEach((_, key) => Cache.delete(key))

      if (!mockApi) return
      if (msw) return

      context.parameters.msw = ApiMock(mockApi(context))
    },
    mswLoader,
  ],
}

export default preview
