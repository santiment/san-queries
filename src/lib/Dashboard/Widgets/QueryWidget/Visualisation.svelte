<script lang="ts">
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import Chart from '$lib/Visualization/Chart'
  import Table from '$lib/Visualization/Table'
  import { ssd } from 'svelte-runes'

  let {
    sqlData,
    widget,
    isSelectable = false,
    columnActions,
  }: {
    widget: App.Dashboard.QueryWidget
    sqlData: App.SqlData
    isSelectable?: boolean
    columnActions?: Map<string, any>
  } = $props()

  const { settings } = useQuerySettingsCtx(widget.query.settings)

  let columnSettings = ssd(() => settings.$.columns)
  let queryVisualisation = $derived(settings.$.visualisation)
</script>

{#if queryVisualisation === 'Chart'}
  <Chart {sqlData} settings={columnSettings}></Chart>
{:else}
  <Table {sqlData} settings={columnSettings} {columnActions} {isSelectable}></Table>
{/if}
