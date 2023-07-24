import { addons } from '@storybook/manager-api'

import 'san-webkit/.storybook/manager.js'

addons.setConfig({
  theme: {
    brandTitle: `
    <div class="column" style="--black:#fff; text-align: center;">
      <svg style="width:113px;height:22px;min-width:113px"><use href="/webkit/sprites/illus/santiment.svg#0"></use></svg>
      <span style="font-family:Monospace; letter-spacing:6px;">queries</span>
    </div>
  `,
  },
})
