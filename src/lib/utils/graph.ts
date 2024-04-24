export function getItemsGraph(items: any[]) {
  const result = [] as any[]
  const first = items[0]

  if (!first) return result

  let lastCategory = first.category
  let lastGroup = first.group

  let groups = [] as any[]
  let groupStart = 0

  items.forEach((item, i) => {
    const { category, group } = item
    const isNewCategory = lastCategory !== category

    if (lastGroup !== group || isNewCategory) {
      groups.push(items.slice(groupStart, i))
      lastGroup = group
      groupStart = i
    }

    if (isNewCategory) {
      result.push(groups)
      lastCategory = category

      groups = []
    }
  })

  groups.push(items.slice(groupStart))
  result.push(groups)

  return result
}
