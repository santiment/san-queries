<script lang="ts">
  import type { TDashboardDataWidgetByType } from '$lib-next/dashboard/ctx/data-widgets.svelte'
  import { useDashboardSqlQueriesCtx } from '$lib-next/dashboard/ctx/dashboard-queries.svelte'
  import { markdownToHTML } from 'san-webkit/lib/ui/Editor/markdown'

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
  <div class="">
    {@html markdownToHTML(columnData.slice(0, 1).toString())}
  </div>
{/if}

<style>
  div :global {
    ol {
      list-style: decimal;
      padding: 8px 0 8px 24px;
    }
  }
</style>
