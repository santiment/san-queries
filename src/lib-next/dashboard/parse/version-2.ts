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
}

export function parseDashboardJSON_v2_to_v3(
  apiDashboard: Partial<TApiDashboard<TDashboardSettings_v2>>,
) {
  const documentContent = apiDashboard.settings?.documentContent ||
    apiDashboard.settings?.__editorJson || {
      type: 'doc',
      content: [],
    }
  const isEmptyDocument = documentContent.content.length === 0

  const dataWidgets: TApiDataWidget[] = []
  const parameterWidgets: TApiDashboardGlobalParameter[] = []

  if (parameterWidgets.length === 0) {
    for (const [parameterId, parameter] of Object.entries(apiDashboard.parameters || {})) {
      if (!parameter) continue

      parameterWidgets.push({
        id: parameterId as TDashboardGlobalParameterKey,
        type: 'text-input-field',
        outputs: parameter.value,

        overrides: {
          value: parameter.overrides.map((item) => [
            item.dashboard_query_mapping_id as TDataWidgetKey,
            item.parameter as TDataWidgetLocalParameterKey,
          ]),
        },
      })
    }

    const parameterNodeCorrections = new Map<
      string,
      { type?: string; value?: any; settings?: any; overridesKey?: string }
    >()
    function correntGlobalParameterType(node: TDocumentNode) {
      if (node.type === 'asset-selector') {
        const corrections = {
          type: node.type,
          value: { slug: node.attrs!['data-value'] },
          overridesKey: 'slug',
        }
        parameterNodeCorrections.set(node.attrs!['data-id']!, corrections)
        return
      } else if (node.type === 'controlled-list') {
        const corrections = {
          type: node.type,
          value: { value: node.attrs!['data-value'] },
          settings: {
            linkedQuery: node.attrs!['data-link-query'],
            linkedColumn: node.attrs!['data-link-column'],
          },
        }
        parameterNodeCorrections.set(node.attrs!['data-id']!, corrections)
      } else if (node.type === 'text-input-field') {
        const corrections = { value: { value: node.attrs!['data-value'] } }
        parameterNodeCorrections.set(node.attrs!['data-id']!, corrections)
      }

      return node.content?.forEach(correntGlobalParameterType)
    }
    documentContent.content.forEach(correntGlobalParameterType)

    for (const globalParameter of parameterWidgets) {
      const corrections = parameterNodeCorrections.get(globalParameter.id)
      if (corrections?.type) globalParameter.type = corrections.type
      if (corrections?.value) {
        globalParameter.outputs = corrections.value

        globalParameter.overrides = {
          [corrections?.overridesKey || 'value']: globalParameter.overrides.value,
        }
      }

      if (corrections?.settings) {
        globalParameter.settings = corrections.settings
      }
    }
  }

  if (dataWidgets.length === 0) {
    for (const query of apiDashboard.queries || []) {
      dataWidgets.push({
        id: query.dashboardQueryMappingId,
        type: 'query-widget',
        data: query,
        settings: {},
      })
    }
  }

  if (isEmptyDocument) {
    documentContent.content.push({ type: 'paragraph' })
  }

  return {
    version: 3 as const,
    documentContent,
    parameterWidgets,
    dataWidgets,
    wasMigrated: true,
  }
}
