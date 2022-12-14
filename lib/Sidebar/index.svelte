<script lang="ts">import Sidebar from 'san-studio/lib/Sidebar/Sidebar.svelte';
import Search from 'san-studio/lib/Sidebar/Search.svelte';
import Category from 'san-studio/lib/Sidebar/Category.svelte';
import { currentUser as currentUser$ } from 'san-studio/lib/stores/user';
import { getAppContext } from './../../lib/context';
import MyDashboards from './MyDashboards.svelte';
import { PremadeDashboards } from './queries';
import Item from './Item.svelte';
const {
  dashboard$
} = getAppContext();
export let searchTerm = '';
export let isFiltering = false; // export let onItemClick

let selected = null;
let selectedPanel;

$: currentUser = $currentUser$; // $: favorites = getFavorites($favoriteMetrics, searchTerm)
// function getFavorites(favoritesSet, searchTerm: string) {}


function onDashboardSelect(dashboard) {
  selected = dashboard;
}

function selectPanel(panel) {
  window.__selectPanel(panel);

  selectedPanel = panel;
  if (window.__clearHoverItem) window.__clearHoverItem();
}

if (process.browser) {
  window.__selectSidebarPanel = panel => {
    selectedPanel = panel;
  };
}</script>

<Sidebar isOpened isLocked>
  <section class="header">
    <!-- <div class="sidebar-project" bind:this={projectNode} /> -->
    <Search bind:searchTerm placeholder="Search dashboards" />
    <!-- <div class="caption c-waterloo mrg-s mrg--t">Available metrics for asset: {metrics.length}</div> -->
  </section>

  <section
    class="sidebar-content"
    on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
    <MyDashboards
      {currentUser}
      {selectedPanel}
      {searchTerm}
      {isFiltering}
      {selectPanel}
      {onDashboardSelect} />

    <Category category="How to get started" {isFiltering} isOpened>
      {#each PremadeDashboards as item}
        <Item
          {item}
          {dashboard$}
          {selectedPanel}
          {selectPanel}
          {selected}
          onSelect={onDashboardSelect} />
      {/each}
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
  z-index: 1;
}
:global(.sidebar-content:hover) {
  overflow-y: auto;
  overflow-y: overlay;
}</style>
