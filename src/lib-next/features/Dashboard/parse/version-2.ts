import { z } from 'zod'
import type {
  TApiDashboard,
  TDashboardDocument,
  TApiDashboardGlobalParameter,
  TDashboardGlobalParameterKey,
  TApiDataWidget,
  TDataWidgetKey,
  TDataWidgetLocalParameterKey,
  TDocumentNode,
} from '../types'

export const DashboardSettingsSchema_v2 = z.object({
  version: z.literal(2),
  __editorJson: z.array(z.any()),
})

// type TDashboardSettingsSchema_v2 = z.infer<typeof DashboardSettingsSchema_v2>

export type TDashboardSettings_v2 = {
  version: 2

  __editorJson?: TDashboardDocument
  documentContent?: TDashboardDocument

  dataWidgets?: TApiDataWidget[]

  globalParameters?: TApiDashboardGlobalParameter[]
}

export function parseDashboardJSON_v2(apiDashboard: TApiDashboard<TDashboardSettings_v2>) {
  const documentContent = apiDashboard.settings.documentContent ||
    apiDashboard.settings.__editorJson || {
      type: 'doc',
      content: [],
    }
  const isEmptyDocument = documentContent.content.length === 0

  const dataWidgets = apiDashboard.settings.dataWidgets || []
  const globalParameters = apiDashboard.settings.globalParameters || []

  if (globalParameters.length === 0) {
    for (const [parameterId, parameter] of Object.entries(apiDashboard.parameters)) {
      if (!parameter) continue

      globalParameters.push({
        id: parameterId as TDashboardGlobalParameterKey,
        type: 'text-input-field',
        value: parameter.value,

        overrides: parameter.overrides.map((item) => [
          item.dashboard_query_mapping_id as TDataWidgetKey,
          item.parameter as TDataWidgetLocalParameterKey,
        ]),
      })
    }

    const parameterNodeType = new Map<string, string>()
    function correntGlobalParameterType(node: TDocumentNode) {
      if (node.type === 'asset-selector') {
        parameterNodeType.set(node.attrs!['data-id']!, node.type)
        return
      }

      return node.content?.forEach(correntGlobalParameterType)
    }
    documentContent.content.forEach(correntGlobalParameterType)

    for (const globalParameter of globalParameters) {
      const correctedType = parameterNodeType.get(globalParameter.id)
      if (correctedType) globalParameter.type = correctedType
    }
  }

  if (isEmptyDocument) {
    documentContent.content.push({ type: 'paragraph' })
  }

  return {
    documentContent,
    globalParameters,
    dataWidgets,
  }
}
