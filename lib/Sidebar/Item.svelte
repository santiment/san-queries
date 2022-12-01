<script lang="ts">import { queryDashboard } from './../../lib/api/dashboard';
import Item from 'san-studio/lib/Sidebar/Item.svelte';
import HoverItem from './HoverItem.svelte';
import Active from './Active.svelte';
export let item;
export let selected;
export let dashboard$;
export let selectedPanel;
export let selectPanel;
export let onSelect;

$: isActive = selected === item.id || selected === item;

function onClick() {
  if (isActive) {
    selectPanel(null);
    return;
  }

  if (item.id === undefined) {
    selectPanel(null);
    dashboard$.set(item);
    if (window.__clearHoverItem) window.__clearHoverItem();
  } else {
    queryDashboard(item.id).then(dashboard => {
      dashboard.panels.forEach(panel => {
        panel.submetricOf = 1;
      });
      selectPanel(null);
      dashboard$.set(dashboard);
      if (window.__clearHoverItem) window.__clearHoverItem();
    });
  }

  if (onSelect) onSelect(item);
}</script>

<Item {item} {HoverItem} active={isActive} on:click={onClick} class="item-hp0pge">
  {#if isActive}
    <Active />
  {/if}
  {item.title}
</Item>

{#if isActive}
  {@const dashboard = $dashboard$}

  {#each dashboard.panels as panel}
    {@const _ = panel.submetricOf = 1}
    <Item
      item={panel}
      {HoverItem}
      active={selectedPanel === panel}
      on:click={() => selectPanel(panel)}
      class="item-hp0pge">
      {#if selectedPanel === panel}
        <Active />
      {/if}
      {panel.name}
    </Item>
  {/each}
{/if}

<style>
  :global(.item-hp0pge) {
    color: var(--black) !important;
  }
</style>
