export function shareColumn({ title, formatterId, isHidden }) {
  const column = { title, formatterId } as any

  if (isHidden) column.isHidden = true

  return column
}
