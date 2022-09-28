<script>import Sidebar from 'san-studio/lib/Sidebar/Sidebar.svelte';
import Search from 'san-studio/lib/Sidebar/Search.svelte';
import Category from 'san-studio/lib/Sidebar/Category.svelte';
import MyDashboards from './MyDashboards.svelte';
export let searchTerm = '';
export let isFiltering = false; // export let onItemClick
// $: favorites = getFavorites($favoriteMetrics, searchTerm)
// function getFavorites(favoritesSet, searchTerm: string) {}</script>

<Sidebar isOpened isLocked>
  <section class="header">
    <!-- <div class="sidebar-project" bind:this={projectNode} /> -->
    <Search bind:searchTerm placeholder="Search dashboards" />
    <!-- <div class="caption c-waterloo mrg-s mrg--t">Available metrics for asset: {metrics.length}</div> -->
  </section>

  <section
    class="sidebar-content"
    on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
    <MyDashboards {searchTerm} {isFiltering} />

    <Category category="How to get started" {isFiltering} isOpened>
      <div class="c-waterloo mrg-s mrg--l">Pre-made sample queries</div>
    </Category>
  </section>
</Sidebar>

<style lang="scss">.header {
  padding: 16px;
  border-bottom: 1px solid var(--porcelain);
}

:global(.sidebar-content) {
  flex: 1;
  overflow: hidden;
  scrollbar-width: thin;
  padding-bottom: 30vh;
  max-width: 258px;
}
:global(.sidebar-content:hover) {
  overflow-y: auto;
  overflow-y: overlay;
}</style>
