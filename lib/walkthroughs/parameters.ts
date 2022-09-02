import { FeatureWalkthrough$ } from 'san-webkit/lib/ui/FeatureWalkthrough/context'
import { awaitChildren } from './utils'

export function showAddParameterWalkthrough() {
  FeatureWalkthrough$.show({
    id: 'fw-add-parameter',
    title: 'Add parameter',
    description: `<p class="mrg-l mrg--b">Add parameters to the query by opening the parameter's creation dialog</p>`,
  })
}

export function showParameterOptionsWalkthrough(parentNode) {
  const node = parentNode.querySelector('.parameter')

  if (node) show(node)
  else awaitChildren(parentNode, show, () => parentNode.querySelector('.parameter'))

  function show(node) {
    node.id = 'fw-parameter-options'

    FeatureWalkthrough$.show({
      id: node.id,
      title: 'Parameter options',
      description: `<p class="mrg-l mrg--b">Click on the parameter to open the options dialog
      <br class="mrg-s mrg--b" />
      Drag and drop the parameter to the editor below to quickly add it to your SQL query
      </p>`,
    })
  }
}
