<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte'

  let {
    id,
    nodeId,
    type,
    position,
  }: {
    id?: string
    nodeId: string
    position: Position
    type: 'input' | 'output'
  } = $props()

  let style = ''
</script>

<Handle
  type={type === 'output' ? 'source' : 'target'}
  position={position ?? (type === 'input' ? Position.Left : Position.Right)}
  {id}
  {style}
/>
