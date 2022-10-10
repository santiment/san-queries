<script lang="ts">
  import { onDestroy } from 'svelte'
  import Query from './Query/index.svelte'
  import Result from './Result/index.svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { Formatter, FormatType } from './Result/Options/format'
  import { setAppContext } from './context'
  import { Dashboard } from './stores/dashboard'
  import Header from './Header/index.svelte'
  import Page from './Page.svelte'

  export let dashboard = null

  const { dashboard$ } = setAppContext({
    dashboard$: Dashboard(dashboard),
  })

  let data
  let id = $dashboard$.id
  let panel = $dashboard$.panels[0]
  let columnsHash = ''
  let error = ''
  let selectedPanel = undefined

  $: columns = data ? data.headers.map(newColumn) : []
  $: columns.length && updateColumns(columns)

  function newColumn(title, i) {
    const { sql: { query } = {} } = panel

    const accessor = (data) => data[i]

    const column = {
      id: i,
      title,
      accessor,
      format: accessor,
      sortAccessor: accessor,
    }

    if (data.dateColumns?.has(i) && !query?.startsWith('SHOW')) {
      const { id, fn } = Formatter[FormatType.DATE]
      column.format = (data) => fn(accessor(data))
      column.formatter = fn
      column.formatterId = id
    }

    return column
  }

  function updateColumns(columns) {
    const { settings } = panel
    const hash = data?.headers.toString() || ''
    const isOldHash = !columnsHash || columnsHash === hash

    if (isOldHash && settings.columns.length === columns.length) {
      settings.columns.forEach((column, i) => {
        Object.assign(columns[i], column)
      })
    }

    columnsHash = hash
    settings.columns = columns
  }

  onDestroy(
    dashboard$.subscribe((dashboard) => {
      if (dashboard.id === id) return

      data = undefined
      id = dashboard.id
      panel = dashboard.panels[0]
    }),
  )
</script>

<div class="row">
  <Sidebar />

  <main class="column">
    <Header {columns} {panel} bind:error bind:data bind:selectedPanel />

    {#if selectedPanel}
      <Query {panel} bind:data bind:error />

      <Result {data} {...data} {columns} />
    {:else}
      <Page
        dashboard={$dashboard$}
        onPanelSelect={(panel) => {
          selectedPanel = panel
        }} />
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
    max-height: calc(100vh + calc(1035px - 100vh));
  }
</style>
