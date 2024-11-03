import { BROWSER } from 'esm-env'
import { validateDashboardDocument } from '../validate'
import { parseDashboardJSON_v2, type TApiDashboard, type TDashboardSettings_v2 } from './version-2'

export type TParsedDashboard = ReturnType<typeof parseDashboardJSON_v2> & {
  version: 3
}

export function parseDashboardDocument(
  apiDashboard: TApiDashboard<TDashboardSettings_v2>,
): TParsedDashboard {
  const parsedDocument: TParsedDashboard = {
    version: 3,
    documentContent: { type: 'doc', content: [] },
    globalParameters: [],
    dataWidgets: [],
  }

  if (apiDashboard.settings.version === 2) {
    const data = parseDashboardJSON_v2(apiDashboard)

    Object.assign(parsedDocument, data)
  }

  return BROWSER ? validateDashboardDocument(parsedDocument) : parsedDocument
}
