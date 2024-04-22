<script lang="ts">
  import { getContext, tick, untrack } from 'svelte'
  import { SvelteFlow, Background, SvelteFlowProvider } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'

  import '@xyflow/svelte/dist/style.css'
  import { useDataFlowCtx } from './ctx'
  import { writable } from 'svelte/store'
  import GenericNode from './nodes/GenericNode'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { debounceTime, pipe, tap } from 'rxjs'
  import { getUI$Ctx } from 'san-webkit/lib/stores/ui'
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'

  const { ui$ } = getUI$Ctx()
  const nodeTypes = { generic: GenericNode }

  const { flowNodes, flowConnections, onNewConnection, onDelete } = useDataFlowCtx()

  const changeIndicatorCtx = useChangeIndicatorCtx()

  const nodes = writable(flowNodes.$.slice())
  const edges = writable(flowConnections.$.slice())

  function updatePositions() {
    Array.from($nodes).forEach((node) => {
      node.data.instance.node.position = node.position
    })

    changeIndicatorCtx.emit.changed()
  }

  const onNodesUpdate = useObserveFnCall(() => pipe(debounceTime(150), tap(updatePositions)))

  function ondelete(deleted: any) {
    onDelete(deleted)
    changeIndicatorCtx.emit.changed()
  }

  function onconnect(connection) {
    onNewConnection(connection)
    changeIndicatorCtx.emit.changed()
  }

  $effect.pre(() => {
    nodes.set(flowNodes.$.slice())
  })

  $effect.pre(
    () => () =>
      untrack(() => {
        const savedNodes = [...$nodes]
        const savedEdges = [...$edges]

        savedNodes.forEach((node) => {
          node.data.instance.node.position = node.position
        })
        flowConnections.$ = savedEdges
      }),
  )
</script>

<SvelteFlowProvider>
  <SvelteFlow
    colorMode={$ui$.isNightMode ? 'dark' : 'light'}
    {nodeTypes}
    {nodes}
    {edges}
    fitView
    zoomOnPinch
    panOnScroll
    {ondelete}
    {onconnect}
    on:nodedragstop={onNodesUpdate}
  >
    <Background />
  </SvelteFlow>
</SvelteFlowProvider>
