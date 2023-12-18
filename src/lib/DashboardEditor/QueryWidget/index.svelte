<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import Chart from '$lib/QueryEditor/Visualisation/Chart/index.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'
  import { showVisualisationFullscreenDialog } from '$lib/QueryEditor/Visualisation/FullscreenDialog/index.svelte'
  import { parseQuerySettings, parseQueryParameters } from '$routes/(editor)/query/ctx'
  import { EventAutoSave$ } from '$routes/(editor)/query/events'
  import Parameter, { COLORS } from '$lib/Parameter'

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
      settings,
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

  {#if parameters.length}
    <parameters class="row gap-s">
      {#each parameters as parameter, i}
        <Parameter {parameter} color={COLORS[i]} onLinkClick={console.log} />
      {/each}
    </parameters>
  {/if}

  {#if settings.visualisation === 'Chart'}
    <Chart {sqlData} ColumnSettings={settings.columns} metricsClass="$style.metrics" />
  {:else}
    <Table border={false} {sqlData} ColumnSettings={settings.columns} />
  {/if}
</query-widget>

<style>
  header {
    padding: 12px 18px 0 12px;
  }

  parameters {
    border-bottom: 1px solid var(--porcelain);
    padding: 12px;
  }

  Table {
    min-height: 0;
  }

  Chart {
    flex: 1;
    min-height: 0;
    padding: 2px;
  }

  .metrics {
    padding: 8px 8px 0;
  }
</style>
