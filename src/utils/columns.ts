type SharedColumn = Pick<SAN.Queries.Column, 'title' | 'formatterId' | 'isHidden' | 'chartStyle'>

export function shareColumn({
  title,
  formatterId,
  chartStyle,
  isHidden,
}: SAN.Queries.Column): SharedColumn {
  const column = { title, chartStyle, formatterId } as SharedColumn

  if (isHidden) column.isHidden = true

  return column
}
