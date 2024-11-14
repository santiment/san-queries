import type { TApiDashboard } from '../types'
import { ApiQuery } from 'san-webkit-next/api'
import { DASHBOARD_FRAGMENT } from '$lib/Dashboard/flow/save/api'

export const queryGetDashboard = ApiQuery(
  (id: number | string) => `{
  data:getDashboard(id:${id}) {
    ${DASHBOARD_FRAGMENT}
    panels {id  name  description  settings  sql {    query    parameters  }  }  
  }
}`,
  (gql: { data: TApiDashboard<any> }) => gql.data,
)
