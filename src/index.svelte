<script>
  import Query from './Query.svelte'
  import Result from './Result.svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { Formatter, FormatType } from './Result/Options/Format.svelte'
  import { setAppContext } from './context'
  import { Dashboard } from './stores/dashboard'
  import { PanelType } from './types'
  import Header from './Header/index.svelte'

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
        title: 'My table',
      },
      { type: PanelType.CHART, title: 'My chart', xAxisKey: 2 },
    ],
  }

  let data

  $: columns = data ? data.headers.map(newColumn) : []
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

  const ctx = setAppContext({
    dashboard$: Dashboard(dashbord),
  })
</script>

<div class="row">
  <Sidebar />

  <main class="column">
    <Header />

    <Query bind:data />

    <Result {data} {...data} {columns} />
  </main>
</div>

<style>
  main {
    padding: 24px 16px;
    background: var(--athens);
    min-height: 100vh;
    flex: 1;
  }
</style>
