<script lang="ts">
  import type { TDashboardDataWidgetByType } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
  import { useDashboardSqlQueriesCtx } from '../../query-widget-block-node/ctx/dashboard-queries.svelte'

  type TProps = { sqlDataWidget?: TDashboardDataWidgetByType['query-widget']; column: number }
  let { sqlDataWidget, column }: TProps = $props()

  const { sqlQueryCachedData } = useDashboardSqlQueriesCtx.get()

  const sqlData = $derived(
    (sqlDataWidget &&
      (sqlDataWidget.state.$$.sqlData || sqlQueryCachedData.get(sqlDataWidget?.id))) || {
      rows: [],
    },
  )
  const rows = $derived(sqlData?.rows || [])
  const columnData = $derived(rows.flatMap((row) => row[column]))
</script>

{#if !columnData || columnData.length === 0}
  Data is empty
{:else}
  {columnData}
{/if}
