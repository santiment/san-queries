<script>
  import Category from 'studio/Sidebar/Category.svelte'
  import { checkIsFilterMatch } from 'studio/metrics/selector/utils'
  import { queryUserDashboards } from '@/api/dashboard'
  import Item from './Item.svelte'

  export let searchTerm
  export let isFiltering

  let items = []
  $: searchedItems = filterDashboards(items, searchTerm)

  queryUserDashboards().then((data) => (items = data))

  function filterDashboards(items, searchTerm) {
    return items.filter((item) => checkIsFilterMatch(searchTerm, item))
  }
</script>

<Category category="My Dashboards" {isFiltering} isOpened>
  {#each searchedItems as item}
    <Item {item} />
  {:else}
    <div class="c-waterloo mrg-s mrg--l">Save new dashboard for quick access</div>
  {/each}
</Category>
