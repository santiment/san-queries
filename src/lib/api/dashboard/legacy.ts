import { query } from 'san-webkit/lib/api'
import { mutateCreateSqlQuery } from '../query/create'
import {
  mutateAddDashboardTextWidget,
  mutateCreateDashboardQuery,
  mutateUpdateDashboard,
} from './create'
import { normalizeGrid, sortLayout } from 'san-webkit/lib/ui/SnapGrid/layout'
import type { SnapItem } from 'san-webkit/lib/ui/SnapGrid/types'

export async function startLegacyMigrationFlow(dashboard: App.ApiDashboard) {
  const { id, panels } = dashboard

  if (!panels) return Promise.reject()

  return Promise.all(
    panels?.map(({ name, sql, settings, value }) => {
      const parameters = Object.keys(sql.parameters).map((key) => {
        return { key, value: sql.parameters[key] }
      })

      if (settings?.type === 'TEXT') {
        return mutateAddDashboardTextWidget({
          dashboardId: id,
          value,
        })
      }

      return mutateCreateSqlQuery({
        name,
        sql: sql.query,
        parameters,
        settings: {
          visualisation: settings?.type === 'CHART' ? 'Chart' : 'Table',
        },
      }).then((query) => {
        // dashboard.queries.push(query)
        return mutateCreateDashboardQuery({
          dashboardId: id,
          queryId: query.id,
        }).then((widget) => widget)
      })
    }),
  ).then((widgets) => {
    const layout = getLayout(panels)

    const settings = {
      version: 2,
      layout: widgets.map((widget, i) => {
        const xywh = layout[i].slice(0, 4) as number[]

        xywh[2] = xywh[2] * 2 // NOTE: Legacy grid has a 6 columns setup, but new -> 12
        xywh[3] = xywh[3] * 3 // NOTE: Legacy grid has a 100px row size, but new -> 26 + margin (aprx. 3 times smaller)

        return { id: widget.id, xywh }
      }),
    }

    return mutateUpdateDashboard({
      id,
      settings,
    })
  })
}

export const queryLegacyDashboardCache = (id: number) =>
  query<any>(`{
  cache:getDashboardCache(id:${id}) {
    panels {
      id
      headers:columns
      rows
      types:columnTypes
    }
  }
}`).then((data) => data.cache.panels)

export function getLayout(panels: App.LegacyPanel[]) {
  const layout = panels.map((panel) => {
    const { layout } = panel.settings || {}
    return (layout || [0, 1000, 6, 5]) as any as SnapItem
  })

  normalizeGrid(sortLayout(layout))

  return layout
}
