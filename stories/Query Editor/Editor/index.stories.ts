import type { Meta, StoryObj } from '@storybook/svelte'

import Component, { TABS } from '$lib/QueryEditor/index.svelte'

const meta = {
  component: Component,
  parameters: {
    bodyStyle: { margin: '30px 0 0' },
    layout: 'fullscreen',
  },
} satisfies Meta<Component>
type Story = StoryObj<typeof meta>

export default meta

export const EditorTab: Story = {}
export const VisualisationTab: Story = {
  args: {
    tab: TABS[1],
  },
}
