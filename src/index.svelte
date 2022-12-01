<script lang="ts">
  import { onDestroy } from 'svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { setAppContext } from './context'
  import { Dashboard as NewDashboard } from './stores/dashboard'
  import Header from './Header/index.svelte'
  import PanelEditor from './PanelEditor/index.svelte'
  import Dashboard from './Dashboard/index.svelte'
  import { queryGetDashboardCache } from './api/query/cache'
  import { applyPanelData } from './utils/columns'
  import { getDashboardPath, getQueryString } from './sharing/url'

  export let dashboard = null
  export let selectedPanel = null

  const { dashboard$ } = setAppContext({
    dashboard$: NewDashboard(dashboard),
  })

  let id = $dashboard$.id

  if (process.browser) {
    if (id) getDashboarCache($dashboard$)

    window.__selectPanel = (panel) => {
      selectedPanel = panel
    }
  }

  $: process.browser && updatePathname($dashboard$, selectedPanel)

  function updatePathname(dashboard, selectedPanel) {
    let path: string = window.__getShareBase?.() || '/'

    if (dashboard.id) {
      path += getDashboardPath(dashboard, selectedPanel)
    } else {
      path += getQueryString(dashboard, selectedPanel)
    }

    window.history.replaceState({}, '', path)
  }

  function getDashboarCache(dashboard) {
    const Panel = {}
    dashboard.panels.forEach((panel) => (Panel[panel.id] = panel))

    queryGetDashboardCache(id)
      .then((panels) =>
        panels.forEach((data) => {
          const panel = Panel[data.id]
          if (!panel) return

          applyPanelData(panel, data)
        }),
      )
      .finally(() => {
        if (id === dashboard.id) {
          dashboard$.set(dashboard)
        }
      })
  }

  onDestroy(
    dashboard$.subscribe((dashboard) => {
      if (dashboard.id === id) return

      id = dashboard.id
      selectedPanel = null

      if (id) getDashboarCache(dashboard)
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
