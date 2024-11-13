import { BROWSER } from 'esm-env'
import { validateDashboardDocument } from '../validate'
import { parseDashboardJSON_v2, type TDashboardSettings_v2 } from './version-2'
import type {
  TApiDashboard,
  TApiDashboardGlobalParameter,
  TApiDataWidget,
  TDashboardDocument,
} from '../types'
import { parseDashboardJSON_v1, type TDashboardSettings_v1 } from './version-1'

export type TParsedDashboard = {
  version: 3
  documentContent: TDashboardDocument
  globalParameters: TApiDashboardGlobalParameter[]
  dataWidgets: TApiDataWidget[]
  wasMigrated: boolean
}

export function parseDashboardDocument(
  apiDashboard: TApiDashboard<TDashboardSettings_v2 | TDashboardSettings_v1>,
): TParsedDashboard {
  const parsedDocument: TParsedDashboard = {
    version: 3,
    documentContent: { type: 'doc', content: [] },
    globalParameters: [],
    dataWidgets: [],
    wasMigrated: false,
  }

  const settings = apiDashboard.settings

  if ('layout' in settings && !('documentContent' in settings)) {
    const data = parseDashboardJSON_v1(apiDashboard as TApiDashboard<TDashboardSettings_v1>)

    Object.assign(parsedDocument, data)
  } else if (settings.version === 2) {
    const data = parseDashboardJSON_v2(apiDashboard)

    Object.assign(parsedDocument, data)
  }

  return BROWSER ? validateDashboardDocument(parsedDocument) : parsedDocument
}
