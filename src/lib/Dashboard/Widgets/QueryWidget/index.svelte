<script lang="ts">
  import Parameter from '$lib/ui/Parameter'
  import { parseQueryParameters, useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
  import { useDashboardParametersCtx, useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
  import Header from './Header.svelte'
  import Visualisation from './Visualisation.svelte'
  import { useDashboardEditorCtx, useQueryColumnActionsCtx } from '$lib/DashboardNext/ctx'
  import { useDataRefreshPromptCtx } from '$lib/DashboardNext/state.svelte'

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

  const { dashboardData, refreshDashboardQueryData } = useDahboardSqlDataCtx()
  const { settings } = useQuerySettingsCtx(widget.query.settings)
  let parameters = $derived(parseQueryParameters(widget.query.sqlQueryParameters))

  const { dashboardEditor } = useDashboardEditorCtx()
  const { globalParameterByOverrides } = useGlobalParametersCtx()
  const { changedParameters } = useDataRefreshPromptCtx()

  const { queryColumnAction } = useQueryColumnActionsCtx()

  let dataState = $derived(dashboardData.get(widget.id))
  let sqlData = $derived(dataState?.displayedData.$)
  let isLoading = $derived(dataState?.isLoading.$ ?? false)

  function onRefreshClick() {
    refreshDashboardQueryData({ dashboardId, widgetId: widget.id })
  }

  function onQueryChangesClick() {
    queryParameterChanges(readonly)
  }
</script>

<section class="flex min-h-0 flex-1 flex-col rounded border bg-white">
  <Header
    {widget}
    {...widget.query}
    {sqlData}
    {currentUser}
    {readonly}
    {onRefreshClick}
    {onQueryChangesClick}
  ></Header>

  {#key globalParameterByOverrides.$}
    {#if parameters.length}
      <section class="flex gap-2 px-3 pb-3">
        {#each parameters as parameter}
          {@const key = widget.id + ',' + parameter.key}
          {@const global = globalParameterByOverrides.$.get(key)}

          <Parameter
            global={!!global}
            {parameter}
            value={global?.value}
            changed={changedParameters.$.has(key)}
          ></Parameter>
        {/each}
      </section>
    {/if}
  {/key}

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
      {#key sqlData}
        <Visualisation {widget} {sqlData} {queryColumnAction}></Visualisation>
      {/key}
    {:else if !isLoading}
      <div class="rounded bg-athens px-5 py-3 text-center">
        <h3 class="text-xl font-bold">No data</h3>
        <p>Execute query first</p>
      </div>
    {/if}
  </div>
</section>
