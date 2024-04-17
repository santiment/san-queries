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
    ...rest
  }: {
    class?: string
    sqlData: App.SqlData
    settings: SS<Record<string, any>>
    isSelectable?: boolean
  } & Super = $props()

  const { dataColumns } = useTableColumnsCtx(sqlData, settings)
  const data = $derived(sqlData.rows)

  const columns = $derived(
    isSelectable
      ? [{ title: 'selection-checkboxes', Cell, Header, className: 'pr-1' }].concat(dataColumns.$)
      : dataColumns.$,
  )
</script>

<table-widget class={cn('flex w-full flex-1 flex-col overflow-auto', className)}>
  <DataTable {...rest} {data} {columns}></DataTable>
</table-widget>
