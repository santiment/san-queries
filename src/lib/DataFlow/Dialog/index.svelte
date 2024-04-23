<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './index.svelte'

  export const showDataFlowDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import Sidebar from './Sidebar.svelte'
  import Canvas from '../Canvas.svelte'
  import { useDataFlowCtx } from '../ctx'
  import { SelectColumnFlowNode } from '../nodes/Interaction/SelectColumnFlowNode'
  import { AssetSelectorFlowNode } from '../nodes/AssetSelector'
  import { TypeIdToCustomFlowNode } from '../nodes'

  let {
    ...rest
  }: {
    DialogCtx: any
  } = $props()

  const dragCtx = { dragged: { x: 0, y: 0 } }
  const { addFlowNode } = useDataFlowCtx()

  function onDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function onDrop(e: DragEvent & { currentTarget: HTMLElement }) {
    e.preventDefault()

    const key = e.dataTransfer!.getData('application/my-app')
    const schema = TypeIdToCustomFlowNode.get(key)

    console.log({ schema })

    if (!schema) return

    const viewportNode = document.querySelector('.svelte-flow__viewport') as null | HTMLElement
    if (!viewportNode) return

    const { left, top } = e.currentTarget.getBoundingClientRect()
    const dropX = e.clientX - left
    const dropY = e.clientY - top

    const transform = viewportNode.style.transform || ''
    const [x, y, scale] = transform
      .slice(0, -1)
      .replace('translate(', '')
      .replace(') scale(', ', ')
      .split('px, ')
      .map((v) => +v)

    const position = {
      x: (dropX - x) / scale - dragCtx.dragged.x,
      y: (dropY - y) / scale - dragCtx.dragged.x,
    }

    addFlowNode(schema, { position })
  }
</script>

<Dialog {...rest} title="Data Flow" class="h-full w-full">
  <main class="relative flex flex-1">
    <div class="w-full" ondrop={onDrop} ondragover={onDragOver}>
      <Canvas />
    </div>

    <Sidebar {dragCtx}></Sidebar>
  </main>
</Dialog>
