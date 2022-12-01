import { getParametersMap } from '@/utils/parameters'

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

export function sharePanelSettings(
  settings: SAN.Queries.PanelSettings,
  sql: { parameters: { type: string }[] },
) {
  const { type, layout, xAxisKey, columns } = settings

  return {
    type,
    xAxisKey,
    layout: layout?.slice(0, 4),
    columns: columns.map(shareColumn),
    parameters: sql.parameters.map(({ type }) => ({ type })),
  }
}

export function sharePanel(panel: SAN.Queries.DashboardPanel) {
  const { name, sql, settings } = panel

  return {
    name,
    sql: { ...sql, parameters: getParametersMap(sql.parameters as any) },
    settings: sharePanelSettings(settings, sql as any),
  }
}

export function shareDashboard(dashboard: SAN.Queries.Dashboard) {
  return dashboard.panels.map(sharePanel)
}
