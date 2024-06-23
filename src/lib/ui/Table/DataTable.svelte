<script lang="ts" generics="T">
  import Table from './index.svelte'
  import Row from './Row.svelte'
  import Cell from './Cell.svelte'
  import HCell from './HCell.svelte'
  import { useTableSort, type Column, type TSortController } from './state.svelte'
  import Pagination, { useTablePagination } from './Pagination'
  import { useTableFilter } from './Filter/state.svelte'
  import { cn } from '../utils'
  import type { Snippet } from 'svelte'

  let {
    class: className,
    columns,
    data,
    onSortClick: _onSortClick,
    sorted: sortedDefaults,
    sortController,
    pagination = true,

    children,
    ...props
  }: {
    class?: string
    data: T[]
    columns: Column[]
    pagination?: boolean

    sortController?: TSortController
    sorted?: Partial<{ column: Column; dir: 'asc' | 'desc' }>
    onSortClick?: (column: Column, dir: 'asc' | 'desc') => void

    children?: Snippet
  } = $props()

  let {
    rows: sortedRows,
    sorted,
    onSortClick,
  } = useTableSort({ ...sortedDefaults, sortController, data, onSortClick: _onSortClick })
  let { rows: filteredRows } = useTableFilter({ data: sortedRows, columns })
  let { rows, page, pageSize } = useTablePagination(filteredRows)
</script>

<paged-table class={cn('block flex-1 overflow-auto', className)}>
  <Table {...props}>
    <thead class="sticky top-0 z-[2]">
      <Row>
        {#each columns as column (column.key)}
          {@const { title, Header } = column}
          {#if Header}
            <svelte:component this={Header} {column} />
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

    {@render children?.()}
  </Table>
</paged-table>

{#if pagination}
  <Pagination totalItems={filteredRows.$.length} {page} {pageSize}></Pagination>
{/if}
