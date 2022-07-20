export function shareColumn({ title, formatterId, chartStyle, isHidden }) {
  const column = { title, chartStyle, formatterId } as any

  if (isHidden) column.isHidden = true

  return column
}
