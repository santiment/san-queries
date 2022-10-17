<script lang="ts">
  import { onDestroy } from 'svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { setAppContext } from './context'
  import { Dashboard as NewDashboard } from './stores/dashboard'
  import Header from './Header/index.svelte'
  import PanelEditor from './PanelEditor/index.svelte'
  import Dashboard from './Dashboard/index.svelte'

  export let dashboard = null

  const { dashboard$ } = setAppContext({
    dashboard$: NewDashboard(dashboard),
  })

  let id = $dashboard$.id
  let selectedPanel = null

  onDestroy(
    dashboard$.subscribe((dashboard) => {
      if (dashboard.id === id) return

      id = dashboard.id
      selectedPanel = null
    }),
  )
</script>

<div class="row">
  <Sidebar />

  <main class="column">
    <Header bind:selectedPanel />

    {#if selectedPanel}
      <PanelEditor panel={selectedPanel} />
    {:else}
      <Dashboard dashboard={$dashboard$} bind:selectedPanel />
    {/if}
  </main>
</div>

<style>
  main {
    padding: 24px 16px;
    background: var(--athens);
    min-height: 100vh;
    min-width: 0;
    flex: 1;
    /* max-height: calc(100vh + calc(1035px - 100vh)); */
  }
</style>
