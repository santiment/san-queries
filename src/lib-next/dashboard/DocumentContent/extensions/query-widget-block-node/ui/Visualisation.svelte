<script lang="ts">
  import { ssd } from 'svelte-runes'
  import Chart from '$lib/Visualization/Chart'
  import Table from '$lib/Visualization/Table'
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'
  import type { TColumnActions } from '../schema'

  type TProps = {
    sqlQuery: App.ApiQueryWidget
    sqlData: App.SqlData
    columnActions?: TColumnActions
  }
  let { sqlQuery, sqlData, columnActions }: TProps = $props()

  const { settings } = useQuerySettingsCtx(sqlQuery.settings)

  let columnSettings = ssd(() => settings.$.columns)
  let queryVisualisation = $derived(settings.$.visualisation)
</script>

{#if queryVisualisation === 'Chart'}
  <Chart {sqlData} settings={columnSettings}></Chart>
{:else}
  {#key columnActions?.size}
    <Table {sqlData} settings={columnSettings} {columnActions}></Table>
  {/key}
{/if}
