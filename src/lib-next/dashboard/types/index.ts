import type { TNominal } from 'san-webkit-next/utils'

export type TAuthor = {
  id: string | number
  username?: null | string
  avatarUrl?: null | string
}

export type TDocumentNode<GType extends string = string> = {
  type: GType
  content?: TDocumentNode[]
  attrs?: Record<string, undefined | string>
  [x: string]: any
}

export type TDashboardDocument = TDocumentNode<'doc'> & { content: TDocumentNode[] }

export type TDashboardKey = TNominal<string, 'TApiDashboardId'>
export type TApiDashboard<GSettings> = {
  id: TDashboardKey

  name: string
  description: null | string

  user: TAuthor

  isPublic: boolean

  commentsCount: number

  votes: { totalVotes: number; userVotes: number }

  parameters: Record<
    string,
    | undefined
    | {
        overrides: { dashboard_query_mapping_id: string; parameter: string }[]
        value: string | string[]
      }
  >

  queries: {
    dashboardQueryMappingId: TDataWidgetKey
    description: null | string
    id: number
    isPublic: boolean
    name: string
    settings: {
      columns: Record<string, any>
      visualisation: 'Table'
    }
    sqlQueryParameters: Record<string, string | string[]>
    sqlQueryText: string
    user: { avatarUrl: null; id: '144899'; username: 'team' }
  }[]

  textWidgets?: { body: null | string }[]

  settings: GSettings
}

export type TDataWidgetKey = TNominal<string, 'TDataWidgetKey'>
export type TApiDataWidget = {
  type: string
  id: TDataWidgetKey

  /** Non-reactive (static) data */
  data?: any

  /** Will be converted to the deeply shared signal */
  settings: any
}

export type TDataWidgetLocalParameterKey = TNominal<string, 'TDataWidgetLocalParameterKey'>

export type TDashboardGlobalParameterKey = TNominal<string, 'TDashboardGlobalParameterKey'>
export type TApiDashboardGlobalParameter<GType extends string = string, GValue = unknown> = {
  id: TDashboardGlobalParameterKey
  type: GType

  outputs: GValue

  overrides: Record<string, undefined | [TDataWidgetKey, TDataWidgetLocalParameterKey][]>
  settings?: Record<string, undefined | any>
}
