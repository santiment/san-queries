<script lang="ts">
  import type { Dashboard$ } from '@/stores/dashboard'

  import Svg from 'webkit/ui/Svg/svelte'
  import { queryDashboard } from '@/api/dashboard'
  import Item from 'studio/Sidebar/Item.svelte'
  import HoverItem from './HoverItem.svelte'
  import Active from './Active.svelte'

  export let item
  export let selected: number
  export let dashboard$: Dashboard$
  export let selectedPanel
  export let selectPanel

  $: isActive = selected === item.id
  // $: panels = isActive
  // $: console.log(isActive, item)

  function onClick() {
    queryDashboard(item.id).then((dashboard) => {
      dashboard.panels.forEach((panel) => {
        panel.submetricOf = 1
      })

      selectPanel(null)
      dashboard$.set(dashboard)

      if (window.__clearHoverItem) window.__clearHoverItem()
    })
  }
</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="$style.item">
  {#if isActive}
    <Active />
  {/if}
  {item.title}
</Item>

{#if isActive}
  {@const dashboard = $dashboard$}

  {#each dashboard.panels as panel}
    <Item
      item={panel}
      {HoverItem}
      active={selectedPanel === panel}
      on:click={() => selectPanel(panel)}
      class="$style.item">
      {#if selectedPanel === panel}
        <Active />
      {/if}
      {panel.name}
    </Item>
  {/each}
{/if}

<style>
  .item {
    color: var(--black) !important;
  }
</style>
