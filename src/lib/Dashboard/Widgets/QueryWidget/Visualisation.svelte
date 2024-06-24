<script lang="ts">
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import Chart from '$lib/Visualization/Chart'
  import Table from '$lib/Visualization/Table'
  import { ssd } from 'svelte-runes'

  let {
    sqlData,
    widget,
    isSelectable = false,
    queryColumnAction,
  }: {
    widget: App.Dashboard.QueryWidget
    sqlData: App.SqlData
    isSelectable?: boolean
    queryColumnAction?: Map<string, any>
  } = $props()

  const { settings } = useQuerySettingsCtx(widget.query.settings)

  let columnSettings = ssd(() => settings.$.columns)
  let queryVisualisation = $derived(settings.$.visualisation)
</script>

{#if queryVisualisation === 'Chart'}
  <Chart {sqlData} settings={columnSettings}></Chart>
{:else}
  <Table {sqlData} settings={columnSettings} {queryColumnAction} {isSelectable}></Table>
{/if}
