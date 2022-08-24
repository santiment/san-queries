<script lang="ts">import { queryDashboard } from './../../lib/api/dashboard';
import Item from 'san-studio/lib/Sidebar/Item.svelte';
import HoverItem from './HoverItem.svelte';
export let item;
export let selected;
export let dashboard$;

$: isActive = selected === item.id;

function onClick() {
  queryDashboard(item.id).then(dashboard => {
    dashboard$.set(dashboard);
  });
}</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="item-7ZrZnb">
  {item.title}
</Item>

<style>
  :global(.item-7ZrZnb) {
    --color-active-hover: var(--green) !important;
  }
</style>
