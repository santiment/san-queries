import { ss, type SS } from 'svelte-runes'

import { SvelteMap as Map } from 'svelte/reactivity'
import { z } from 'zod'
import { FilterScheme, checkIsEmptyFilter, type FilterSchemeType } from '$lib/ui/Table/Filter/types'
import { getContext, setContext } from 'svelte'
import type { Column as TableColumn } from '..'

const CTX = 'useTableFilter'

export function useTableFilter<
  Item,
  Column extends Pick<TableColumn, 'title' | 'filter' | 'valueKey'>,
>({ data, columns }: { data: Item[] | SS<Item[]>; columns: Column[] }) {
  const items = $derived(Array.isArray(data) ? data : data.$)
  const filteredItems = ss(items)

  const ValueKeyByColumn = {} as Record<string, number | string>
  const FilterTypeByColumn = columns.reduce(
    (acc, column) => {
      if (column.filter) {
        ValueKeyByColumn[column.title] = column.valueKey
        return Object.assign(acc, { [column.title]: column.filter })
      }

      return acc
    },
    {} as Record<Column['title'], 'search' | 'number'>,
  )
  const columnFilter: Map<Column['title'], FilterSchemeType | { type: string; value?: undefined }> =
    new Map(
      Object.keys(FilterTypeByColumn).map((key: Column['title']) => [
        key,
        { type: FilterTypeByColumn[key], value: undefined },
      ]),
    )

  $effect(() => {
    const nonEmptyFilters = Array.from(columnFilter.entries()).filter(
      ([_, filter]) => !!filter.value,
    ) as [Column['title'], FilterSchemeType][]

    if (nonEmptyFilters.length === 0) {
      filteredItems.$ = items
      return
    }

    filteredItems.$ = items.filter((item) =>
      nonEmptyFilters.every(([column, filter]) => {
        const key = ValueKeyByColumn[column] ?? column
        const data = (item as any)[key]

        if (data === undefined) return false

        switch (filter.type) {
          case 'search':
            return filter
              ? data.toString().toLowerCase().includes(filter.value?.toLowerCase())
              : true
          case 'number':
            return z
              .number()
              .min(filter.value.min ?? -Infinity)
              .max(filter.value.max ?? Infinity)
              .safeParse(data).success
        }
      }),
    )
  })

  return setContext(CTX, {
    rows: filteredItems,
    columnFilter,
    applyFilter(column: Column['title'], filter: FilterSchemeType['value']) {
      const result = FilterScheme.safeParse({ type: FilterTypeByColumn[column], value: filter })

      if (!result.success) return

      if (checkIsEmptyFilter(result.data)) {
        result.data.value = undefined
      }

      columnFilter.set(column, result.data)
    },
  })
}

useTableFilter.getCtx = () => getContext(CTX) as ReturnType<typeof useTableFilter>
