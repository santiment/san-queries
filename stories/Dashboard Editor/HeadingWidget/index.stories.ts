import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/DashboardEditor/HeadingWidget/index.svelte'
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

const Heading = (value: string) => ({
  type: 'HEADING',
  value,
})

export const Empty: Story = {
  args: {
    widget: Heading(''),
  },
}

export const WithValue: Story = {
  args: {
    widget: Heading('Hello! This is heading widget'),
  },
}

export const LongValue: Story = {
  args: {
    widget: Heading(
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, eveniet odit consequatur officiis quo in consectetur suscipit dignissimos rerum aliquid esse voluptatem earum alias blanditiis rem. Odio eaque fugiat omnis hic dolorem excepturi, debitis natus consequuntur rem quod unde ducimus inventore pariatur soluta? Libero quam itaque, blanditiis asperiores beatae unde placeat deserunt quasi corrupti, eos eligendi molestiae facere a dicta aperiam non velit assumenda aspernatur ex neque. Voluptatum unde beatae ut, velit ad magni eius at atque magnam nemo minus quia officia earum! Ad natus autem ullam facere rerum quasi commodi consequatur, veritatis blanditiis distinctio expedita necessitatibus aliquid beatae doloribus.',
    ),
  },
}
