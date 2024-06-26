<script lang="ts">
  import type { TEditorWidget } from '$lib/DashboardNext/ctx'

  let { queryWidget, column }: { queryWidget: TEditorWidget<App.ApiQuery>; column: string } =
    $props()

  let rows: any[] = $derived(queryWidget?.state.get('sqlData')?.rows || [])
  let columnData = $derived(rows.flatMap((row) => row[column]))
</script>

{#if !columnData || columnData.length === 0}
  Data is empty
{:else}
  {columnData}
{/if}
