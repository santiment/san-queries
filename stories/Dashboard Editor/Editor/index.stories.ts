import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/DashboardEditor/index.svelte'

const meta = {
  component: Component,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/svelte/configure/story-layout
    layout: 'fullscreen',

    docs: { story: { height: 500 } },
  },
} satisfies Meta<Component>
type Story = StoryObj<typeof meta>

export default meta

export const LoggedIn: Story = {
  parameters: {
    mockApi: () => ({
      currentUser: {},
    }),
  },
}
