<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Sidebar from 'studio/Sidebar/Sidebar.svelte'
  import Search from 'studio/Sidebar/Search.svelte'
  import Category from 'studio/Sidebar/Category.svelte'
  import MyDashboards from './MyDashboards.svelte'

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick

  // $: favorites = getFavorites($favoriteMetrics, searchTerm)

  // function getFavorites(favoritesSet, searchTerm: string) {}
</script>

<Sidebar isOpened isLocked>
  <section class="header">
    <!-- <div class="sidebar-project" bind:this={projectNode} /> -->
    <Search bind:searchTerm />
    <!-- <div class="caption c-waterloo mrg-s mrg--t">Available metrics for asset: {metrics.length}</div> -->
  </section>

  <section class="sidebar-content">
    <Category category="Favorites" {isFiltering} isOpened class="favorites">
      <svelte:fragment slot="pre-title">
        <Svg id="star-filled" w="16" class="mrg-s mrg--r $style.star" />
      </svelte:fragment>

      <div class="c-waterloo mrg-s mrg--l">Save any dashboard to 'Favorites' for quick access</div>
    </Category>

    <MyDashboards {searchTerm} {isFiltering} />
  </section>
</Sidebar>

<style lang="scss">
  .star {
    fill: var(--orange);
  }

  .header {
    padding: 16px;
    border-bottom: 1px solid var(--porcelain);
  }

  :global {
    .sidebar-content {
      flex: 1;
      overflow: hidden;
      scrollbar-width: thin;
      padding-bottom: 30vh;
      max-width: 258px;
    }
  }
</style>
