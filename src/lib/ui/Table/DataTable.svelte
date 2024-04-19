<script lang="ts" generics="T">
  import Table from './index.svelte'
  import Row from './Row.svelte'
  import Cell from './Cell.svelte'
  import HCell from './HCell.svelte'
  import { useTableSort, type Column, type TSortController } from './state.svelte'
  import Pagination, { useTablePagination } from './Pagination'
  import { useTableFilter } from './Filter/state.svelte'
  import { cn } from '../utils'

  let {
    class: className,
    columns,
    data,
    onSortClick: _onSortClick,
    sorted: sortedDefaults,
    sortController,
    ...props
  }: {
    class?: string
    data: T[]
    columns: Column[]

    sortController?: TSortController
    sorted?: Partial<{ column: Column; dir: 'asc' | 'desc' }>
    onSortClick?: (column: Column, dir: 'asc' | 'desc') => void
  } = $props()

  let {
    rows: sortedRows,
    sorted,
    onSortClick,
  } = useTableSort({ ...sortedDefaults, sortController, data, onSortClick: _onSortClick })
  let { rows: filteredRows } = useTableFilter({ data: sortedRows, columns })
  let { rows, page, pageSize } = useTablePagination(filteredRows)
</script>

<paged-table class={cn('block flex-1 overflow-auto')}>
  <Table {...props}>
    <thead class="sticky top-0 z-[2]">
      <Row>
        {#each columns as column (column.key)}
          {@const { title, Header } = column}
          {#if Header}
            <svelte:component this={Header} />
          {:else}
            <HCell {column} {sorted} onSortClick={column.sortAccessor && onSortClick}>
              {title}
            </HCell>
          {/if}
        {/each}
      </Row>
    </thead>

    <tbody class="divide-y">
      {#each rows.$ as row}
        <Row>
          {#each columns as column (column.key)}
            {@const { valueKey, Cell: Component, className } = column}
            <Cell class={className}>
              {#if Component}
                <svelte:component this={Component} {row} value={row[valueKey]} />
              {:else}
                {column.format ? column.format(row[valueKey]) : row[valueKey]}
              {/if}
            </Cell>
          {/each}
        </Row>
      {/each}
    </tbody>
  </Table>
</paged-table>

<Pagination totalItems={filteredRows.$.length} {page} {pageSize}></Pagination>
