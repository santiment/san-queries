import type { Meta, StoryObj } from '@storybook/svelte'

import Component from '$lib/QueryEditor/ScreenControls.svelte'
import { TABS } from '$lib/QueryEditor/index.svelte'

const meta = {
  component: Component,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/svelte/configure/story-layout
    layout: 'fullscreen',
    docs: { story: { height: 140 } },
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

export const MultipleParameters: Story = {
  args: {
    parameters: [
      { key: 'WETH', value: 'Ox12...659' },
      { key: 'WETH', value: 'Ox12...659' },
      { key: 'WETH', value: 'Ox12...659' },
      { key: 'WETH', value: 'Ox12...659' },
      { key: 'WETH', value: 'Ox12...659' },
    ],
  },
}
