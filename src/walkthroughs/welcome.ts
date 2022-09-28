import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'
import { BR } from './utils'

export function showWelcomeWalkthrough() {
  FeatureWalkthrough$.show({
    id: 'fw-welcome',
    title: 'Welcome to Sanquery',
    description: `<p class="mrg-l mrg--b">Sanquery is an online SQL Editor that gives access to a wide range of blockchain-related datasets.
    ${BR}
    You can start by browse existing queries in the ‘How to get started’ section on the left.
    ${BR}
    Then check out our documentation to get a broader overview of what you can do with this tool.</p>`,
    align: 'right',
  })
}
