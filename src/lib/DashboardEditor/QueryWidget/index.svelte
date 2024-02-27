<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Profile from 'webkit/ui/Profile/svelte'
  import { queryRunDashboardSqlQuery } from '$lib/api/query'
  import { compressQuery, mutateCompressedQueryExecutionResult } from '$lib/api/dashboard/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import Chart from '$lib/QueryEditor/Visualisation/Chart/index.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'
  import { showVisualisationFullscreenDialog } from '$lib/QueryEditor/Visualisation/FullscreenDialog/index.svelte'
  import { parseQuerySettings, parseQueryParameters } from '$routes/(editor)/query/ctx'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import { EventAutoSave$, EventDashboardUpdateQueries$ } from '$routes/(editor)/query/events'
  import Parameter, { COLORS } from '$lib/Parameter'
  import { showLinkGlobalParameterDialog$ } from './LinkGlobalParameterDialog.svelte'
  import {
    mutateAddDashboardGlobalParameterOverride,
    mutateDeleteDashboardGlobalParameterOverride,
  } from '../Globals/api'

  export let widget: App.Dashboard.QueryWidget
  export let CachedData: any
  export let isDashboardAuthor = false

  const showLinkGlobalParameterDialog = showLinkGlobalParameterDialog$()
  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: sqlData = CachedData[widget.id] as any

  $: dashboardEditor = $dashboardEditor$
  $: settings = parseQuerySettings(widget.query.settings)
  $: parameters = parseQueryParameters(widget.query.sqlQueryParameters)
  $: dashboardQueryParams = dashboardEditor.parameters.reduce((acc, value) => {
    Object.keys(value.overrides[widget.id] || {}).forEach((key) => {
      acc[key] = value
    })

    return acc
  }, {})

  // $: console.log({ dashboardQueryParams })

  function updateData() {
    if (!widget.id) return

    getData()
      .then((data) => {
        const { headers, types, ...rest } = data

        CachedData[widget.id] = data

        return compressQuery({ ...rest, columns: headers, columnTypes: types })
      })
      .then((compressed) =>
        mutateCompressedQueryExecutionResult({
          compressed,
          dashboardId: dashboardEditor.dashboard.id,
          dashboardQueryMappingId: widget.id,
        }),
      )
  }

  const eventDashboardUpdateQueries = EventDashboardUpdateQueries$(updateData)
  $eventDashboardUpdateQueries

  function getData() {
    // const query = widget.query as App.ApiQuery

    return queryRunDashboardSqlQuery(dashboardEditor.dashboard.id, widget.id).then((data) => {
      sqlData = data
      return data
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

  function onParameterClick(parameter: any) {
    const dashboardId = dashboardEditor.dashboard.id
    const globalParameter = dashboardQueryParams[parameter.key]

    const dashboardQueryMappingId = widget.id

    showLinkGlobalParameterDialog({
      widget,
      parameter,
      globalParameter,
    }).then((newGlobalParameter) => {
      if (globalParameter === newGlobalParameter) return

      // Global parameter removed
      if (!newGlobalParameter && globalParameter) {
        return mutateDeleteDashboardGlobalParameterOverride({
          dashboardId,
          dashboardParameterKey: globalParameter.key,
          dashboardQueryMappingId,
        }).then(() => {
          delete globalParameter.overrides[widget.id][parameter.key]
          dashboardEditor$.unlinkGlobalParameter()
        })
      }

      // Add global parameter
      if (!globalParameter && newGlobalParameter) {
        return mutateAddDashboardGlobalParameterOverride({
          dashboardId,
          dashboardParameterKey: newGlobalParameter.key,
          queryParameterKey: parameter.key,
          dashboardQueryMappingId,
        }).then(() => {
          let widgetOverrides = newGlobalParameter.overrides[widget.id]
          if (!widgetOverrides) widgetOverrides = newGlobalParameter.overrides[widget.id] = {}

          widgetOverrides[parameter.key] = true

          dashboardEditor$.unlinkGlobalParameter()
        })
      }
    })
  }
</script>

<query-widget class="column border">
  <header class="row v-center fluid gap-s">
    {#if widget.user}
      <Profile user={widget.user} source="dashboard" feature="query" />

      <div class="divider" />
    {/if}

    <h2 class="body-2">
      <a href="/query/{getSEOLinkFromIdAndTitle(widget.query.id, widget.title)}">{widget.title}</a>
    </h2>

    <button class="btn-3 mrg-a mrg--l expl-tooltip" aria-label="Refresh data" on:click={updateData}>
      <Svg id="refresh" w="14" />
    </button>

    <button class="btn-3 expl-tooltip" aria-label="Open fullscreen" on:click={onFullscreenClick}>
      <Svg id="fullscreen" w="14" />
    </button>

    {#if isDashboardAuthor}
      <button class="close btn-3 expl-tooltip" aria-label="Remove widget" on:click={onCloseClick}>
        <Svg id="close" w="12" />
      </button>
    {/if}
  </header>

  {#if parameters.length}
    <parameters class="row gap-s">
      {#each parameters as parameter, i}
        <Parameter
          {parameter}
          color={COLORS[i]}
          globalParameter={dashboardQueryParams[parameter.key]}
          onLinkClick={() => onParameterClick(parameter)}
        />
      {/each}
    </parameters>
  {/if}

  {#if settings.visualisation === 'Chart'}
    <Chart {sqlData} ColumnSettings={settings.columns} metricsClass="$style.metrics" />
  {:else}
    <Table border={false} {sqlData} ColumnSettings={settings.columns} />
  {/if}

  {#if !sqlData}
    <no-data class="c-waterloo">Refresh query to get data</no-data>
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

  no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--athens);
    padding: 6px 10px;
    border-radius: 4px;
  }

  .divider {
    height: 32px;
    width: 1px;
    background: var(--mystic);
  }
</style>
