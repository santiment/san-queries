import type { Meta, StoryObj } from '@storybook/svelte'

import NavHeader from './index.svelte'

const meta = {
  title: 'Example/NavHeader',
  component: NavHeader,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/svelte/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<NavHeader>
type Story = StoryObj<typeof meta>

export default meta

export const LoggedIn: Story = {
  args: {
    currentUser: {
      username: 'Tester',
    },
  },
  parameters: {
    mockApi: (story) => ({
      'query currentUser': story.args.currentUser,
      'query checkAnnualDiscountEligibility': { test: true },
    }),
  },
}

export const LoggedOut: Story = {}
