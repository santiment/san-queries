import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/DashboardEditor/QueryWidget/index.svelte'
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

const Widget = (): App.Dashboard.QueryWidget => ({
  type: 'QUERY',
  title: 'Bitcoin daily active addresses',
})

export const Table: Story = {
  args: {
    widget: Widget(),
  },
}

export const Chart: Story = {
  args: {
    widget: Widget(),
  },
}
