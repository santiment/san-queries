<script lang="ts">
  import type { QUERY_WIDGET_BLOCK_NODE } from '../schema'
  import type { TDataWidgetProps } from '../../schema/data-widget'

  import { useDashboardCtx } from '$lib-next/dashboard/ctx'
  import Visualisation from './Visualisation.svelte'
  import Header from './Header.svelte'
  import Parameters from './Parameters.svelte'
  import { showFullscreenDialog$ } from './FullscreenDialog.svelte'
  import UpdatePrompt from './UpdatePrompt.svelte'
  import { useSqlWidgetFlow } from '../ctx'
  import Resizer from '../../utils/Resizer.svelte'

  let { view, data }: TDataWidgetProps<typeof QUERY_WIDGET_BLOCK_NODE> = $props()

  const { id, widget } = data
  const _state = widget.state

  const { dashboard } = useDashboardCtx.get()
  const { sqlQuery, sqlQueryCachedData, localParameters, parameterOverrides, loadSqlData } =
    useSqlWidgetFlow(widget)

  const showFullscreenDialog = showFullscreenDialog$()

  let dirtyParametersMap = $state.raw(new Map<string, null | string>())

  const columnActions = $derived(_state.$$.__columnActions)
  const sqlData = $derived(_state.$$.sqlData || sqlQueryCachedData.get(id))

  $effect(() => {
    const dirty = new Map()
    const overrides = parameterOverrides.$
    const lastFetchedValues = _state.$$.lastFetchedParameterValues

    for (const parameterKey in localParameters) {
      const value = overrides[parameterKey] || localParameters[parameterKey]
      const lastFetchedValue = lastFetchedValues[parameterKey]

      if (value?.toString() !== lastFetchedValue?.toString()) {
        dirty.set(parameterKey, value)
      }
    }

    dirtyParametersMap = dirty
  })

  // TODO: Focus on editor when delete widget pressed
</script>

<section class="flex min-h-0 flex-1 flex-col rounded border bg-white">
  <Header
    id={sqlQuery.id}
    name={sqlQuery.name}
    author={sqlQuery.user}
    onFullscreenClick={() => sqlData && showFullscreenDialog({ sqlQuery, sqlData })}
    onRefreshClick={() => loadSqlData({ isForced: true })}
    onDeleteClick={() => {
      view.$.deleteNode()
      view.$.editor.commands.focus()
    }}
  ></Header>

  {#if dashboard.isEditable}
    {#key localParameters}
      <Parameters {localParameters} {parameterOverrides} {dirtyParametersMap}></Parameters>
    {/key}
  {/if}

  <div class="relative flex min-h-0 flex-1 flex-col items-center justify-center border-t">
    {#if _state.$$.isLoading}
      <div
        class="absolute left-0 top-0 z-[2] flex h-full w-full items-center justify-center bg-white/70"
      >
        <div class="flex rounded bg-athens px-9 py-7">
          <loading-spin style="--loading-size:48px;border-width:6px"></loading-spin>
        </div>
      </div>
    {:else}
      <UpdatePrompt
        isOpened={dirtyParametersMap.size > 0}
        onUpdateClick={() => loadSqlData({ isForced: false })}
      ></UpdatePrompt>
    {/if}

    {#if sqlData}
      {#key sqlData}
        <Visualisation {sqlQuery} {sqlData} {columnActions}></Visualisation>
      {/key}
    {:else if !!_state.$$.isLoading}
      <div class="rounded bg-athens px-5 py-3 text-center">
        <h3 class="text-xl font-bold">No data</h3>
        <p>Execute query first</p>
      </div>
    {/if}
  </div>
</section>

{#if dashboard.isEditable}
  <Resizer {view}></Resizer>
{/if}
