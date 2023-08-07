import type { Meta, StoryObj } from '@storybook/svelte'

import NavHeader from '$lib/NavHeader/index.svelte'

const meta = {
  component: NavHeader,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/svelte/configure/story-layout
    layout: 'fullscreen',
    docs: { story: { height: 200 } },
  },
} satisfies Meta<NavHeader>
type Story = StoryObj<typeof meta>

export default meta

export const LoggedIn: Story = {
  parameters: {
    mockApi: () => ({
      currentUser: {},
    }),
  },
}

export const LoggedOut: Story = {
  parameters: {
    mockApi: () => ({
      currentUser: null,
    }),
  },
}
