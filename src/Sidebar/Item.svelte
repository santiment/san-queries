<script lang="ts">
  import { queryDashboard } from '@/api/dashboard'
  import { getAppContext } from '@/context'
  import Item from 'studio/Sidebar/Item.svelte'
  import HoverItem from './HoverItem.svelte'

  export let item

  const { dashboard$ } = getAppContext()

  $: isActive = false // $selectedLayout && +item.id === +$selectedLayout?.id

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
