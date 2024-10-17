import { DASHBOARD_FRAGMENT } from '$lib/Dashboard/flow/save/api'
import { ApiQuery } from 'san-webkit-next/api'
// import { Fetcher } from '$lib/api'

export const queryGetDashboard = ApiQuery(
  (id: number | string) => `{
  data:getDashboard(id:${id}) {
    ${DASHBOARD_FRAGMENT}
    panels {id  name  description  settings  sql {    query    parameters  }  }  
  }
}`,
  (gql: { data: App.ApiDashboard }) => gql.data,
)

declare global {
  namespace App {
    type ApiTextWidget = { id: string; body: null | string }
    type ApiQueryWidget = App.ApiQuery & { dashboardQueryMappingId: string }

    type ApiDashboard = {
      id: number
      name: string
      description?: null | string
      isPublic: boolean
      settings: null | App.Dashboard.ApiSettings
      user: App.Author

      commentsCount: number
      votes: { totalVotes: number; userVotes: number }

      textWidgets: ApiTextWidget[]
      queries: ApiQueryWidget[]

      panels?: { id: number }[] // App.LegacyPanel[]
      // isLegacy?: boolean

      parameters: Record<
        string,
        {
          overrides: { dashboard_query_mapping_id: string; parameter: string }[]
          value: number | string
        }
      >
    }

    type LegacyPanel = {
      id: string
      name: string
      description?: string
      settings?: { type: 'TEXT' | 'CHART'; columns?: []; layout?: []; parameters?: [] }
      sql: { query: string; parameters: Record<string, string> }
    }
  }
}
