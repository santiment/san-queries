<script lang="ts">import { onMount, onDestroy } from 'svelte';
import HoverItem from 'san-studio/lib/Sidebar/HoverItem.svelte';
export let item;
export let node;
export let hoverNode;
let timer;

const showPreview = () => false; // queryLayout(item.id).then((data) => destroyed || (layout = data))


function startPreviewTimer() {
  window.clearTimeout(timer);
  timer = window.setTimeout(showPreview, 150);
}

function closePreview() {
  window.clearTimeout(timer);
}

onMount(startPreviewTimer);
onDestroy(closePreview);</script>

<HoverItem {node} {hoverNode}>
  {item.title}
</HoverItem>
