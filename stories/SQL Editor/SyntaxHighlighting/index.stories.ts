import type { Meta, StoryObj } from '@storybook/svelte'

import Component from './index.svelte'

const meta = {
  component: Component,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/svelte/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<Component>
type Story = StoryObj<typeof meta>

export default meta

export const SyntaxHighlighting: Story = {}
