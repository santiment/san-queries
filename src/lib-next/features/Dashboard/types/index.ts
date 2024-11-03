import type { TNominal } from 'san-webkit-next/utils'

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

export type TDataWidgetKey = TNominal<string, 'TDataWidgetKey'>
export type TApiDataWidget = { type: string; id: TDataWidgetKey; data: any }

export type TDataWidgetLocalParameterKey = TNominal<string, 'TDataWidgetLocalParameterKey'>

export type TDashboardGlobalParameterKey = TNominal<string, 'TDashboardGlobalParameterKey'>
export type TApiDashboardGlobalParameter<GType extends string = string, GValue = unknown> = {
  id: TDashboardGlobalParameterKey
  type: GType
  value: GValue
  overrides: [TDataWidgetKey, TDataWidgetLocalParameterKey][]
}
