<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Sidebar from 'studio/Sidebar/Sidebar.svelte'
  import Category from 'studio/Sidebar/Category.svelte'

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick

  // $: favorites = getFavorites($favoriteMetrics, searchTerm)

  // function getFavorites(favoritesSet, searchTerm: string) {}
</script>

<Sidebar isOpened isLocked>
  <div class="sidebar-content">
    <Category category="Favorites" {isFiltering} isOpened class="favorites">
      <svelte:fragment slot="pre-title">
        <Svg id="star-filled" w="16" class="mrg-s mrg--r $style.star" />
      </svelte:fragment>

      <div class="c-waterloo mrg-s mrg--l">Save any metric to 'Favorites' for quick access</div>
    </Category>
  </div>
</Sidebar>

<style lang="scss">
  .star {
    fill: var(--orange);
  }

  .sidebar {
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
