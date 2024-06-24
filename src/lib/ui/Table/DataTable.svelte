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
  import Button from 'san-webkit-next/ui/core/Button'

  let {
    class: className,
    columns,
    data,
    onSortClick: _onSortClick,
    sorted: sortedDefaults,
    sortController,
    pagination = true,
    minRows = 0,

    children,
    ...props
  }: {
    class?: string
    data: T[]
    columns: Column[]
    pagination?: boolean
    minRows?: number

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

  const COLUMN_PADDING = '<td></td>'
  function getMinRows(minRows: undefined | number, itemsLength: number, columnsLength: number) {
    if (!minRows) return ''

    const rowsAmount = (minRows as number) - itemsLength
    if (rowsAmount <= 0) return ''

    const columnsPadding = ''.padStart(columnsLength * COLUMN_PADDING.length, COLUMN_PADDING)

    let rows = ''
    for (let i = 0; i < rowsAmount; i++) {
      rows += '<tr>' + columnsPadding + '</tr>'
    }
    return rows
  }
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
              {#if column.action}
                <div class="group flex">
                  <Button
                    icon="plus-circle"
                    iconSize="12"
                    explanation={column.action.label}
                    onclick={() => column.action.onclick(row[valueKey])}
                    style="--expl-left: -4px;--expl-position-y:0px"
                  ></Button>
                  {@render cell()}
                </div>
              {:else}
                {@render cell()}
              {/if}

              {#snippet cell()}
                {#if Component}
                  <svelte:component this={Component} {row} value={row[valueKey]} />
                {:else}
                  {column.format ? column.format(row[valueKey]) : row[valueKey]}
                {/if}
              {/snippet}
            </Cell>
          {/each}
        </Row>
      {/each}
      {#if rows.$.length < minRows}
        {@html getMinRows(minRows, rows.$.length, columns.length)}
      {/if}
    </tbody>

    {@render children?.()}
  </Table>
</paged-table>

{#if pagination}
  <Pagination totalItems={filteredRows.$.length} {page} {pageSize}></Pagination>
{/if}
