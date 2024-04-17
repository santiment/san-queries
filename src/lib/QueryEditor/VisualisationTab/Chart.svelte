<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { SS } from 'svelte-runes'

  import Visualisation from '$lib/Visualization/Chart'
  import { useChartVisualizationCtx } from '$lib/Visualization/Chart/ctx.svelte'
  import * as Field from '$lib/ui/Field'
  import * as Control from './Control'
  import { useQuerySettingsCtx } from '../ctx'

  let {
    sqlData,
    children,
    columnSettings,
  }: {
    sqlData: App.SqlData
    columnSettings: SS<App.ColumnSettings>
    children: Snippet<
      [
        {
          visualisation: typeof visualisation
          visualisationControls: typeof visualisationControls
          columnControls: typeof columnControls
          openedColumns: Set<string>
        },
      ]
    >
  } = $props()

  const querySettingsCtx = useQuerySettingsCtx()
  const { ctx } = useChartVisualizationCtx(sqlData, columnSettings)

  const openedColumns = new Set([...Object.keys(ctx.$.MetricByColumn), ...ctx.$.dateColumns])
</script>

{#snippet visualisation()}
  <Visualisation {sqlData} settings={columnSettings}></Visualisation>
{/snippet}

{#snippet visualisationControls()}{/snippet}

{#snippet columnControls({column, columnSettings}: {column: string, columnSettings: App.ColumnSettings[string]})}
  {@const metric = ctx.$.MetricByColumn[column]}
  {#if metric}
    <Field.Select
      name="Chart style"
      options={['Line', 'Bars', 'Area'] as const}
      value={columnSettings.chartNode ?? 'Line'}
      onChange={(chartNode) => {
        querySettingsCtx.applyColumnSettings(column, { chartNode })
      }}
    ></Field.Select>

    <Control.Checkbox
      name="visibility"
      {column}
      value={columnSettings.isHiddenOnChart ?? true}
      onChange={(isVisible) => {
        querySettingsCtx.applyColumnSettings(column, { isHiddenOnChart: !isVisible })
      }}
    ></Control.Checkbox>

    <Control.Color
      name="chartColor"
      {column}
      value={metric.color}
      onChange={(chartColor) => {
        querySettingsCtx.applyColumnSettings(column, { chartColor })
      }}
    ></Control.Color>
  {/if}
{/snippet}

{@render children({ visualisation, visualisationControls, columnControls, openedColumns })}
