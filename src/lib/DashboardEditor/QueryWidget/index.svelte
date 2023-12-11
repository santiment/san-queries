<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'
  import { showVisualisationFullscreenDialog } from '$lib/QueryEditor/Visualisation/FullscreenDialog/index.svelte'
  import { parseQuerySettings, parseQueryParameters } from '$routes/(editor)/query/ctx'
  import { EventAutoSave$ } from '$routes/(editor)/query/events'

  export let widget: App.Dashboard.QueryWidget

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  let sqlData: any

  $: settings = parseQuerySettings(widget.query.settings)
  $: parameters = parseQueryParameters(widget.query.sqlQueryParameters)

  $: if (process.browser) {
    getData()
  }

  function getData() {
    const query = widget.query as App.ApiQuery
    console.log(query)

    queryComputeRawClickhouseQuery({
      sql: query.sqlQueryText,
      parameters: JSON.stringify(query.sqlQueryParameters),
    }).then((data) => {
      sqlData = data
    })
  }

  function onFullscreenClick() {
    showVisualisationFullscreenDialog({
      title: widget.title,
      sqlData,
    })
  }

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)

    EventAutoSave$.dispatch()
  }
</script>

<query-widget class="column border">
  <header class="row v-center fluid gap-s">
    <h2 class="body-2">{widget.title}</h2>

    <button
      class="btn-3 mrg-a mrg--l expl-tooltip"
      aria-label="Refresh data"
      on:click={console.log}
    >
      <Svg id="refresh" w="14" />
    </button>

    <button class="btn-3 expl-tooltip" aria-label="Open fullscreen" on:click={onFullscreenClick}>
      <Svg id="fullscreen" w="14" />
    </button>

    <button class="close btn-3 expl-tooltip" aria-label="Remove widget" on:click={onCloseClick}>
      <Svg id="close" w="12" />
    </button>
  </header>

  <Table border={false} {sqlData} ColumnSettings={settings.columns} />
</query-widget>

<style>
  header {
    padding: 12px 18px 12px 12px;
    border-bottom: 1px solid var(--porcelain);
  }

  Table {
    max-height: calc(100% - 57px);
  }
</style>
