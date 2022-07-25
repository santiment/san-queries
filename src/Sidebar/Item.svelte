<script lang="ts">
  import type { Dashboard$ } from '@/stores/dashboard'
  import { queryDashboard } from '@/api/dashboard'
  import Item from 'studio/Sidebar/Item.svelte'
  import HoverItem from './HoverItem.svelte'

  export let item
  export let selected: number
  export let dashboard$: Dashboard$

  $: isActive = selected === item.id

  function onClick() {
    queryDashboard(item.id).then((dashboard) => {
      dashboard$.set(dashboard)
    })
  }
</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="$style.item">
  {item.title}
</Item>

<style>
  .item {
    --color-active-hover: var(--green) !important;
  }
</style>
