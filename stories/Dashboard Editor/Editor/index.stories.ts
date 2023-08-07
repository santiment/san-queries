import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/DashboardEditor/index.svelte'

const meta = {
  component: Component,
  // tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',

    // docs: { story: { height: 500 } },
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
