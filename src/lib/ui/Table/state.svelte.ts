import { untrack, type ComponentType } from 'svelte'
import { ss, type SS } from 'svelte-runes'

export type Column = {
  key: string
  title: string
  valueKey: string

  filter?: 'number' | 'search'
  Header?: ComponentType
  Cell?: ComponentType

  sortAccessor?: (row: unknown) => number
}

type Direction = 'asc' | 'desc'

export type TSortController = {
  column: SS<undefined | Column>
  direction: SS<Direction | undefined>
}

export function useTableSort<T>({
  data,

  direction,
  column,
  sortController,

  onSortClick: _onSortClick,
}: {
  data: T[]

  column?: Column
  direction?: Direction
  sortController?: TSortController

  onSortClick?: (column: Column, dir: Direction) => void
}) {
  const rows = ss(data)

  const sorted: TSortController = sortController || {
    column: ss(column),
    direction: ss(direction),
  }

  $effect.pre(() => {
    if (!sorted.column.$ || !sorted.direction.$) {
      rows.$ = data
      return
    }

    const { sortAccessor } = sorted.column.$
    if (!sortAccessor) return

    const sorter =
      sorted.direction.$ === 'asc'
        ? (a: T, b: T) => sortAccessor(a) - sortAccessor(b)
        : (a: T, b: T) => sortAccessor(b) - sortAccessor(a)

    rows.$ = untrack(() => rows.$.slice().sort(sorter))
  })

  function onSortClick(column: Column) {
    if (!column.sortAccessor) return

    const isDescSort = sorted.column.$ === column ? sorted.direction.$ === 'desc' : false
    const direction = isDescSort ? 'asc' : 'desc'

    sorted.direction.$ = direction
    sorted.column.$ = column

    _onSortClick?.(column, direction)
  }

  return {
    rows,
    sorted,
    onSortClick,
  }
}
