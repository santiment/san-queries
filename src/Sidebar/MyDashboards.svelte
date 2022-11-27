<script>
  import Category from 'studio/Sidebar/Category.svelte'
  import { checkIsFilterMatch } from 'studio/metrics/selector/utils'
  import Item from './Item.svelte'
  import { myDashboards$ } from '@/stores/dashboards'
  import { getAppContext } from '@/context'

  export let searchTerm
  export let selectedPanel
  export let isFiltering
  export let selectPanel
  export let onDashboardSelect

  const { dashboard$ } = getAppContext()

  $: selected = $dashboard$.id
  $: items = $myDashboards$
  $: searchedItems = filterDashboards(items, searchTerm)

  function filterDashboards(items, searchTerm) {
    return items.filter((item) => checkIsFilterMatch(searchTerm, item))
  }
</script>

<Category category="My Dashboards" {isFiltering} isOpened>
  {#each searchedItems as item}
    <Item
      {item}
      {selected}
      {dashboard$}
      {selectedPanel}
      {selectPanel}
      onSelect={onDashboardSelect} />
  {:else}
    <div class="c-waterloo mrg-s mrg--l">Save new dashboard for quick access</div>
  {/each}
</Category>
