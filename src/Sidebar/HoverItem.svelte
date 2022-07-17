<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import HoverItem from 'studio/Sidebar/HoverItem.svelte'

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let timer
  let layout = {} // as SAN.Layout
  let destroyed = false

  $: isAuthor = false // $currentUser && layout.user && +layout.user.id === +$currentUser.id

  const showPreview = () => false // queryLayout(item.id).then((data) => destroyed || (layout = data))

  function startPreviewTimer() {
    window.clearTimeout(timer)
    timer = window.setTimeout(showPreview, 150)
  }
  function closePreview() {
    destroyed = true
    window.clearTimeout(timer)
  }

  function onEditClick() {}

  function onAddClick() {}

  onMount(startPreviewTimer)
  onDestroy(closePreview)
</script>

<HoverItem {node} {hoverNode}>
  {item.title}
</HoverItem>

<style>
  .preview {
    position: absolute;
    left: 100%;
    min-width: 350px;
    max-width: 400px;
    cursor: initial;
    color: var(--black);
    margin-left: 2px;
    padding: 20px;
  }
  .preview::before {
    content: '';
    position: absolute;
    left: -5px;
    width: 5px;
    top: 0;
    bottom: 0;
  }

  .btn {
    --bg: none;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
    margin-left: 12px;
  }
</style>
