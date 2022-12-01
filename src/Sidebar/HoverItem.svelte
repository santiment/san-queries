<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import HoverItem from 'studio/Sidebar/HoverItem.svelte'
  import Active from './Active.svelte'

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let timer

  const showPreview = () => false // queryLayout(item.id).then((data) => destroyed || (layout = data))

  function startPreviewTimer() {
    window.clearTimeout(timer)
    timer = window.setTimeout(showPreview, 150)
  }
  function closePreview() {
    window.clearTimeout(timer)
  }

  onMount(startPreviewTimer)
  onDestroy(closePreview)
</script>

<HoverItem {node} {hoverNode}>
  <Active class="$style.circle" />

  {item.title || item.name}
</HoverItem>

<style>
  .circle {
    display: none;
  }

  :global(.item.active) .circle {
    display: flex;
  }
</style>
