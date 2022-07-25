<script lang="ts">
  import Query from './Query/index.svelte'
  import Result from './Result/index.svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { Formatter, FormatType } from './Result/Options/Format.svelte'
  import { setAppContext } from './context'
  import { Dashboard } from './stores/dashboard'
  import { PanelType } from './types'
  import Header from './Header/index.svelte'
  import { onDestroy } from 'svelte'
  import { shareColumn } from './utils/columns'

  export let dashbord = null

  const { dashboard$ } = setAppContext({
    dashboard$: Dashboard(dashbord),
  })

  let data
  let id = $dashboard$.id
  let panel = $dashboard$.panels[0]

  $: columns = data ? data.headers.map(newColumn) : []
  $: updateColumns(columns)
  $: console.log(data)
  $: console.log(panel)

  function newColumn(title, i) {
    const accessor = (data) => data[i]

    const column = {
      id: i,
      title,
      accessor,
      format: accessor,
      sortAccessor: accessor,
    }

    if (data.dateColumns.has(i)) {
      const { id, fn } = Formatter[FormatType.DATE]
      column.format = (data) => fn(accessor(data))
      column.formatter = fn
      column.formatterId = id
    }

    return column
  }

  function updateColumns(columns) {
    panel.settings.columns.forEach((column, i) => {
      Object.assign(columns[i], column)
    })
    panel.settings.columns = columns
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
    <Header {columns} {panel} bind:data />

    <Query bind:data {panel} />

    <Result {data} {...data} {columns} />
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
