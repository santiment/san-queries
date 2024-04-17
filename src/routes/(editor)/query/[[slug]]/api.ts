import { Fetcher } from '$lib/api'
import { QUERY_FRAGMENT } from '$lib/QueryEditor/api'

type TQuery = {
  id: number
  name: string
  description?: null | string
  isPublic: boolean
  user: App.Author

  sqlQueryParameters: Record<string, number | string>
  sqlQueryText: string
  settings?: App.ApiQuerySettings
}

export const queryGetSqlQuery = Fetcher(
  (id: number) => `{
  query:getSqlQuery(id:${id}) {
    ${QUERY_FRAGMENT}
  }
}`,
  (data: { query: App.ApiQuery }) => data.query,
)

declare global {
  namespace App {
    type ApiQuery = TQuery
  }
}
