import type {
  TApiDashboard,
  TApiDashboardGlobalParameter,
  TApiDataWidget,
  TDashboardDocument,
} from '../types'

export type TDashboardSettings_v3 = {
  version: 3

  documentContent: TDashboardDocument
  parameterWidgets: TApiDashboardGlobalParameter[]
  dataWidgets: TApiDataWidget[]
}

export function parseDashboardJSON_v3(apiDashboard: TApiDashboard<TDashboardSettings_v3>) {
  const settings = apiDashboard.settings || {}

  return {
    version: 3 as const,
    documentContent: settings.documentContent || { type: 'doc', content: [] },
    dataWidgets: settings.dataWidgets || [],
    parameterWidgets: settings.parameterWidgets || [],
    wasMigrated: false,
  }
}
