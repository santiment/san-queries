import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/DashboardEditor/TextWidget/index.svelte'
import Decorator from '../DashboardDecorator.svelte'

const meta = {
  component: Component,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: 200 } },
  },
  decorators: [
    (_, { args }) => ({
      Component: Decorator,
      props: { ...args },
    }),
  ],
} satisfies Meta<Component>
type Story = StoryObj<typeof meta>

export default meta

const Widget = (value: string): App.Dashboard.TextWidget => ({
  type: 'TEXT',
  value,
})

export const Empty: Story = {
  args: {
    widget: Widget(''),
  },
}

export const WithValue: Story = {
  args: {
    widget: Widget(
      'Hello! This is **text** widget with a [markdown](https://app.santiment.net/) _support_',
    ),
  },
}

export const LongValue: Story = {
  args: {
    widget: Widget(
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, eveniet odit consequatur officiis quo in consectetur suscipit dignissimos rerum aliquid esse voluptatem earum alias blanditiis rem. Odio eaque fugiat omnis hic dolorem excepturi, debitis natus consequuntur rem quod unde ducimus inventore pariatur soluta? Libero quam itaque, blanditiis asperiores beatae unde placeat deserunt quasi corrupti, eos eligendi molestiae facere a dicta aperiam non velit assumenda aspernatur ex neque. Voluptatum unde beatae ut, velit ad magni eius at atque magnam nemo minus quia officia earum! Ad natus autem ullam facere rerum quasi commodi consequatur, veritatis blanditiis distinctio expedita necessitatibus aliquid beatae doloribus.',
    ),
  },
}
