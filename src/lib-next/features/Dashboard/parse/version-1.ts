import type { TApiDashboard, TDashboardDocument } from '../types'

export type TDashboardSettings_v1 = {
  // NOTE: Yes, legacy version also has version: 2
  version: 2

  layout: any[]
}

export function parseDashboardJSON_v1(apiDashboard: TApiDashboard<TDashboardSettings_v1>) {
  const documentContent: TDashboardDocument = { type: 'doc', content: [] }
  const dataWidgets = []

  for (const textWidget of apiDashboard.textWidgets || []) {
    documentContent.content.push({
      type: 'paragraph',
      content: textWidget.body ? [{ type: 'text', text: textWidget.body }] : [],
    })
  }

  for (const query of apiDashboard.queries) {
    dataWidgets.push({
      id: query.dashboardQueryMappingId,
      type: 'query-widget',
      data: query,
      settings: {},
    })

    documentContent.content.push({
      type: 'query-widget',
      attrs: {
        'data-id': query.dashboardQueryMappingId,
      },
    })
  }

  if (documentContent.content.length === 0) {
    documentContent.content.push({ type: 'paragraph' })
  }

  return {
    documentContent,
    dataWidgets,
    globalParameters: [],
    wasMigrated: true,
  }
}
