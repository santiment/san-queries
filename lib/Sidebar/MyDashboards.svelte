<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Category from 'san-studio/lib/Sidebar/Category.svelte';
import { checkIsFilterMatch } from 'san-studio/lib/metrics/selector/utils';
import Item from './Item.svelte';
import { myDashboards$ } from './../stores/dashboards';
import { getAppContext } from './../context';
import { showSaveDashboardDialog } from './../SaveDashboardDialog.svelte';
export let currentUser;
export let searchTerm;
export let selectedPanel;
export let isFiltering;
export let selectPanel;
export let onDashboardSelect;
const {
  dashboard$
} = getAppContext();

$: selected = $dashboard$.id;

$: items = $myDashboards$;

$: searchedItems = filterDashboards(items, searchTerm);

function filterDashboards(items, searchTerm) {
  return items.filter(item => checkIsFilterMatch(searchTerm, item));
}

function onAdd() {
  if (!currentUser) return;
  const dashboard = $dashboard$;
  showSaveDashboardDialog({
    title: 'Save new dashboard',
    action: 'Save',
    dashboard: Object.assign(Object.assign({}, dashboard), {
      id: undefined
    })
  }).then(dashboard => {
    if (dashboard) dashboard$.set(dashboard);
  });
}</script>

<Category category="My Dashboards" {isFiltering} isOpened arrowClass="mrg-l">
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

  <svelte:fragment slot="post-title">
    <button class="btn mrg-a mrg--l row hv-center" on:click|stopPropagation={onAdd}>
      <Svg id="plus" w="10" />
    </button>
  </svelte:fragment>
</Category>

<style >.btn {
  --fill: var(--waterloo);
  --fill-hover: var(--green);
}
.btn:hover + :global(svg) {
  fill: var(--waterloo);
}</style>
