import { ss, ssd } from 'svelte-runes'

export function useTablePagination<Item>(
  items: SS<Item[]>,
  { defaultPageSize = 25 }: Partial<{ defaultPageSize: number }> = {},
) {
  const page = ss(0)
  const pageSize = ss(defaultPageSize)
  const pageOffset = $derived(page.$ * pageSize.$)
  const pageEndOffset = $derived(pageOffset + pageSize.$)

  const pagedItems = ssd(() => items.$.slice(pageOffset, pageEndOffset))

  return { rows: pagedItems, pageSize, page }
}
