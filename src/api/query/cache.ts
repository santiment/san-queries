import { query } from 'webkit/api'
import { PANEL_DATA_FRAGMENT } from './raw'

const GET_DASHBOARD_CACHE_QUERY = (id) => `
{
  cache:getDashboardCache(id:${id}) {
    panels {
${PANEL_DATA_FRAGMENT}
    }
  }
}`

function accessor({ cache }) {
  return cache.panels.map((panel) => {
    panel.dateColumns = new Set<number>()
    panel.types.forEach((type, i) => {
      if (type.startsWith('Date')) panel.dateColumns.add(i)
    })
    return panel
  })
}
export const queryGetDashboardCache = (dashboardId: number) =>
  query<any>(GET_DASHBOARD_CACHE_QUERY(dashboardId), {
    cache: false,
  }).then(accessor)
