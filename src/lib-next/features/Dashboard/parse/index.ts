import { BROWSER } from 'esm-env'
import { validateDashboardDocument } from '../validate'
import { parseDashboardJSON_v2_to_v3, type TDashboardSettings_v2 } from './version-2'
import type {
  TApiDashboard,
  TApiDashboardGlobalParameter,
  TApiDataWidget,
  TDashboardDocument,
} from '../types'
import { parseDashboardJSON_v1_to_v3, type TDashboardSettings_v1 } from './version-1'
import { parseDashboardJSON_v3, type TDashboardSettings_v3 } from './version-3'

export type TParsedDashboard = {
  version: 3
  documentContent: TDashboardDocument
  parameterWidgets: TApiDashboardGlobalParameter[]
  dataWidgets: TApiDataWidget[]

  wasMigrated: boolean
}

export function parseDashboardDocument(
  apiDashboard: TApiDashboard<
    TDashboardSettings_v3 | TDashboardSettings_v2 | TDashboardSettings_v1
  >,
): TParsedDashboard {
  const parsedDocument: TParsedDashboard = {
    version: 3,
    documentContent: { type: 'doc', content: [] },
    parameterWidgets: [],
    dataWidgets: [],
    wasMigrated: false,
  }

  const settings = apiDashboard.settings

  if (settings.version === 3) {
    const data = parseDashboardJSON_v3(
      apiDashboard as TApiDashboard<TDashboardSettings_v3>,
    ) satisfies TParsedDashboard

    Object.assign(parsedDocument, data)
  } else if ('layout' in settings && !('documentContent' in settings)) {
    const data = parseDashboardJSON_v1_to_v3(
      apiDashboard as TApiDashboard<TDashboardSettings_v1>,
    ) satisfies TParsedDashboard

    Object.assign(parsedDocument, data)
  } else if (settings.version === 2) {
    const data = parseDashboardJSON_v2_to_v3(
      apiDashboard as TApiDashboard<TDashboardSettings_v2>,
    ) satisfies TParsedDashboard

    Object.assign(parsedDocument, data)
  }

  return BROWSER ? validateDashboardDocument(parsedDocument) : parsedDocument
}
