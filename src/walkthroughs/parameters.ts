import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'

export function showParameterOptionsWalkthrough(parametersNode) {
  const node = parametersNode.querySelector('.parameter')

  if (node) show(node)
  else {
    const config = { childList: true }
    const observer = new MutationObserver(() => {
      const node = parametersNode.querySelector('.parameter')
      if (node) {
        show(node)
        observer.disconnect()
      }
    })
    observer.observe(parametersNode, config)
  }

  function show(node) {
    node.id = 'fw-parameter-options'

    FeatureWalkthrough$.show({
      id: node.id,
      title: 'Parameter options',
      description: `<p class="mrg-l mrg--b">Click on the parameter to open the options dialog</p>`,
    })
  }
}
