<script lang="ts">
  import { ssd } from 'svelte-runes'
  import Chart from '$lib/Visualization/Chart'
  import Table from '$lib/Visualization/Table'
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'

  type TProps = { sqlQuery: App.ApiQueryWidget; sqlData: App.SqlData }
  let { sqlQuery, sqlData }: TProps = $props()

  const { settings } = useQuerySettingsCtx(sqlQuery.settings)

  let columnSettings = ssd(() => settings.$.columns)
  let queryVisualisation = $derived(settings.$.visualisation)
</script>

{#if queryVisualisation === 'Chart'}
  <Chart {sqlData} settings={columnSettings}></Chart>
{:else}
  <Table {sqlData} settings={columnSettings}></Table>
{/if}
