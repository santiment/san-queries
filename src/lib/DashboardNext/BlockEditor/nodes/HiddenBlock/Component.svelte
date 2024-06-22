<script>
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { NodeViewWrapper, NodeViewContent } from 'tiptap-svelte-adapter'
</script>

<NodeViewWrapper>
  <div class="gap-3 rounded border border-dashed border-blue p-3 column">
    <div class="items-center gap-2 rounded border border-blue bg-blue-light-1 fill-blue p-3 row">
      <Svg id="info" w="16"></Svg>
      This block is only visible during editing. It will be hidden in the view mode.
    </div>

    <NodeViewContent class="rounded border border-dashed border-blue p-3"></NodeViewContent>
  </div>
</NodeViewWrapper>
