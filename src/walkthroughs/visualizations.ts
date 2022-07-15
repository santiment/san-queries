import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'
import { awaitChildren } from './utils'

export function showResultVisualizationsWalkthrough(parentNode) {
  const node = parentNode.firstElementChild

  if (node) show()
  else awaitChildren(parentNode, show, () => parentNode.firstElementChild)

  function show() {
    FeatureWalkthrough$.show({
      id: 'fw-visulizations-select',
      title: "Result's visualizations",
      description: `<p class="mrg-l mrg--b">Change between visualizations and customize them inside the option's pane on the right</p>`,
    })
  }
}
