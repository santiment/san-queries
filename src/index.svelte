<script>
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

  export let dashbord = null && {
    id: 0,
    title: 'My query',
    description: 'Hello this is dashboard',
    user: {
      username: 'Tim_Jones',
    },
    commentsCount: 3,
    votes: {},
    panels: [
      {
        type: PanelType.TABLE,
        name: 'My table',
      },
      { type: PanelType.CHART, name: 'My chart', xAxisKey: 2 },
    ],
  }

  const { dashboard$ } = setAppContext({
    dashboard$: Dashboard(dashbord),
  })

  let data

  $: columns = data ? data.headers.map(newColumn) : []
  $: updateColumns(columns)
  $: console.log(data)

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
    $dashboard$.settings.columns.forEach((column, i) => {
      Object.assign(columns[i], column)
    })
    $dashboard$.settings.columns = columns
  }

  let id = $dashboard$.id
  onDestroy(
    dashboard$.subscribe((dashboard) => {
      if (dashboard.id === id) return

      data = undefined
      id = dashboard.id
    }),
  )
</script>

<div class="row">
  <Sidebar />

  <main class="column">
    <Header {columns} />

    <Query bind:data />

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
  }
</style>
