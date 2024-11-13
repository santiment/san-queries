<script>
  import { NodeViewWrapper, NodeViewContent } from 'tiptap-svelte-adapter'
  import Note from '../../Note.svelte'
</script>

<NodeViewWrapper>
  <div class="gap-3 rounded border border-dashed border-blue p-3 column">
    <Note>This block is only visible during editing. It will be hidden in the view mode.</Note>

    <NodeViewContent class="rounded border border-dashed border-blue p-3"></NodeViewContent>
  </div>
</NodeViewWrapper>
