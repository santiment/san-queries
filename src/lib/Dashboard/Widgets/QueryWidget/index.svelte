<script lang="ts">
  import { ssd } from 'svelte-runes'
  import Parameter from '$lib/ui/Parameter'
  import Chart from '$lib/Visualization/Chart'
  import Table from '$lib/Visualization/Table'
  import { parseQueryParameters, useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
  import { useDashboardParametersCtx } from '$lib/Dashboard/ctx/parameters'
  import Header from './Header.svelte'
  import { showLinkGlobalParameterDialog$ } from './LinkGlobalParameterDialog.svelte'

  let {
    dashboardId,
    readonly = true,
    currentUser,
    widget,
  }: {
    dashboardId: number
    readonly?: boolean
    widget: App.Dashboard.QueryWidget
    currentUser?: any
  } = $props()

  const showLinkGlobalParameterDialog = showLinkGlobalParameterDialog$()
  const { dashboardData, refreshDashboardQueryData } = useDahboardSqlDataCtx()
  const { settings } = useQuerySettingsCtx(widget.query.settings)
  const { parameters: globalParameters, globalParameterOverrides } = useDashboardParametersCtx()

  let parameters = $derived(parseQueryParameters(widget.query.sqlQueryParameters))
  let columnSettings = ssd(() => settings.$.columns)
  let queryVisualisation = $derived(settings.$.visualisation)
  let dataState = $derived(dashboardData.get(widget.id))

  let sqlData = $derived(dataState?.default.$)
  let isLoading = $derived(dataState?.isLoading.$ ?? false)

  function onLinkClick(parameter: (typeof parameters)[number], globalParameter: any) {
    const queryWidgetId = widget.id
    if (!queryWidgetId) return

    showLinkGlobalParameterDialog({
      queryWidgetId,
      parameter,
      globalParameter,
      strict: true,
    }).then((newGlobalParameter) => {
      globalParameter?.overrides.delete(queryWidgetId)
      newGlobalParameter?.overrides.set(queryWidgetId, parameter.key)

      globalParameters.$ = globalParameters.$
    })
  }

  function onRefreshClick() {
    refreshDashboardQueryData({ dashboardId, widgetId: widget.id })
  }
</script>

<section class="flex min-h-0 flex-1 flex-col rounded border bg-white">
  <Header {widget} {...widget.query} {currentUser} {readonly} {onRefreshClick}></Header>

  {#if parameters.length}
    <section class="flex gap-2 px-3 pb-3">
      {#each parameters as parameter (parameter.key)}
        {@const globals = globalParameterOverrides.$.get(widget.id, parameter.key)}
        {@const global = globals?.[0]}

        {#key globals}
          <Parameter
            global={!!global}
            parameter={global || parameter}
            onLinkClick={() => onLinkClick(parameter, global)}
          ></Parameter>
        {/key}
      {/each}
    </section>
  {/if}

  <hr class="border-t" />

  <div class="relative flex min-h-0 flex-1 flex-col items-center justify-center">
    {#if isLoading}
      <div
        class="absolute left-0 top-0 z-[2] flex h-full w-full items-center justify-center bg-white/70"
      >
        <div class="flex rounded bg-athens px-9 py-7">
          <loading-spin style="--loading-size:48px;border-width:6px" />
        </div>
      </div>
    {/if}

    {#if sqlData}
      {#if queryVisualisation === 'Chart'}
        <Chart {sqlData} settings={columnSettings}></Chart>
      {:else}
        <Table {sqlData} settings={columnSettings}></Table>
      {/if}
    {:else if !isLoading}
      <div class="rounded bg-athens px-5 py-3 text-center">
        <h3 class="text-xl font-bold">No data</h3>
        <p>Execute query first</p>
      </div>
    {/if}
  </div>
</section>
