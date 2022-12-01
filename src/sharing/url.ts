import { getSEOLinkFromIdAndTitle, parse } from 'webkit/utils/url'
import { shareDashboard } from './index'

export function getQueryString(
  dashboard: SAN.Queries.Dashboard,
  selectedPanel?: SAN.Queries.DashboardPanel,
) {
  let qs = '?panels=' + encodeURIComponent(JSON.stringify(shareDashboard(dashboard)))

  if (selectedPanel) {
    qs += '&selected=' + dashboard.panels.findIndex((panel) => panel === selectedPanel)
  }

  return qs
}

export function getDashboardPath(
  dashboard: SAN.Queries.Dashboard,
  selectedPanel?: SAN.Queries.DashboardPanel,
) {
  const { id, title } = dashboard
  const path = getSEOLinkFromIdAndTitle(id, title) + '/'

  return path + (selectedPanel?.id || '')
}

export function parseSharedUrl(queryString: string): {
  panels?: SAN.Queries.DashboardPanel[]
  selectedPanelId?: number
} {
  const shared = parse(queryString) as { panels?: string; selected?: string }

  try {
    const panels = shared.panels ? JSON.parse(shared.panels) : undefined

    return { panels, selectedPanelId: +(shared.selected as string) }
  } catch (e) {
    console.error(e)
    return {}
  }
}
