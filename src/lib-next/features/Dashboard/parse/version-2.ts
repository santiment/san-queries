import type { TNominal } from 'san-webkit-next/utils'
import { z } from 'zod'

export const DashboardSettingsSchema_v2 = z.object({
  version: z.literal(2),
  __editorJson: z.array(z.any()),
})

// type TDashboardSettingsSchema_v2 = z.infer<typeof DashboardSettingsSchema_v2>

export type TDocumentNode<GType extends string = string> = {
  type: GType
  content?: TDocumentNode[]
  attrs?: Record<string, undefined | string>
  [x: string]: any
}

export type TDashboardDocument = TDocumentNode<'doc'> & { content: TDocumentNode[] }

export type TApiDashboard<GSettings> = {
  id: TNominal<string, 'TApiDashboardId'>

  parameters: Record<
    string,
    | undefined
    | {
        overrides: { dashboard_query_mapping_id: string; parameter: string }[]
        value: string | string[]
      }
  >

  settings: GSettings
}

type TDataWidgetKey = TNominal<string, 'TDataWidgetKey'>
type TDataWidget = { type: string; id: TDataWidgetKey; data: any }

type TDataWidgetLocalParameterKey = TNominal<string, 'TDataWidgetLocalParameterKey'>

type TDashboardGlobalParameterKey = TNominal<string, 'TDashboardGlobalParameterKey'>
type TDashboardGlobalParameter = {
  id: TDashboardGlobalParameterKey
  type: string
  value: any
  overrides: [TDataWidgetKey, TDataWidgetLocalParameterKey[]][]
}

export type TDashboardSettings_v2 = {
  version: 2

  __editorJson?: TDashboardDocument
  documentContent?: TDashboardDocument

  dataWidgets?: TDataWidget[]

  globalParameters?: TDashboardGlobalParameter[]
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
        overrides: Array.from(
          parameter.overrides.reduce((acc, value) => {
            const dataWidgetKey = value.dashboard_query_mapping_id as TDataWidgetKey
            const localParameterKey = value.parameter as TDataWidgetLocalParameterKey

            const overrides = acc.get(dataWidgetKey)

            if (overrides) overrides.push(localParameterKey)
            else acc.set(dataWidgetKey, [localParameterKey])

            return acc
          }, new Map<TDataWidgetKey, TDataWidgetLocalParameterKey[]>()),
        ),
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
