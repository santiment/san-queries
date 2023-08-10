import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/QueryHead/index.svelte'

const meta = {
  component: Component,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/svelte/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<Component>
type Story = StoryObj<typeof meta>

export default meta

const author = {
  id: 0,
  username: 'test',
}

export const LoggedIn: Story = {
  args: {
    author,
  },
  parameters: {
    mockApi: () => ({
      currentUser: {},
    }),
  },
}

export const LoggedInAuthor: Story = {
  args: {
    author: { ...author, id: 0 },
  },
  parameters: {
    mockApi: () => ({
      currentUser: author,
    }),
  },
}

export const LoggedOut: Story = {
  args: { author },
  parameters: {
    mockApi: () => ({
      currentUser: null,
    }),
  },
}
