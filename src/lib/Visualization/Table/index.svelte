<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import type { SS } from 'svelte-runes'

  import DataTable from '$lib/ui/Table/DataTable.svelte'
  import { cn } from '$lib/ui/utils'
  import Header from './Selectable/Header.svelte'
  import Cell from './Selectable/Cell.svelte'
  import { useTableColumnsCtx } from './ctx.svelte'

  type Super = ComponentProps<DataTable<any>>
  let {
    sqlData,
    settings,
    isSelectable = false,
    class: className,
    queryColumnAction,
    ...rest
  }: {
    class?: string
    sqlData: App.SqlData
    settings: SS<Record<string, any>>
    isSelectable?: boolean
    queryColumnAction?: Map<string, any>
  } & Super = $props()

  const { dataColumns } = useTableColumnsCtx(sqlData, settings, queryColumnAction)
  const data = $derived(sqlData.rows)

  const columns = $derived(
    isSelectable
      ? [{ key: 'selection-checkboxes', Cell, Header, className: 'pr-1' }, ...dataColumns.$]
      : dataColumns.$,
  )
</script>

<table-widget class={cn('flex w-full flex-1 flex-col overflow-auto', className)}>
  <DataTable {...rest} {data} {columns}></DataTable>
</table-widget>
