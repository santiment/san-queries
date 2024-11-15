<script lang="ts">
  import { GripVertical } from 'lucide-svelte'

  let dragNode: HTMLElement

  $effect(() => {
    if (!dragNode) return

    const blockActionsNode = document.querySelector('.global-drag-handle')
    if (!blockActionsNode) return

    blockActionsNode.append(dragNode)
    dragNode.classList.remove('hidden')
  })
</script>

<button bind:this={dragNode} class="flex hidden h-6 w-5 cursor-grab rounded center hover:bg-athens">
  <GripVertical></GripVertical>
</button>

<style>
  :root {
    --droparea-color: #5399e4;
  }

  :global {
    .global-drag-actions {
      @apply absolute translate-y-[5px];
    }
  }
</style>
