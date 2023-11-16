import { Universal } from 'webkit/api'

export const QUERY_FRAGMENT = `id
      name
      description
      isPublic
      #createdAt # Cannot return null for non-nullable field
      settings
      sqlQueryParameters
      sqlQueryText`

export const queryGetSqlQuery = Universal(
  (query) => (id: number) =>
    query<SAN.API.Query<'query', App.ApiQuery>>(`{
        query:getSqlQuery(id:${id}) {
          ${QUERY_FRAGMENT}
        }
      }`).then(({ query }) => query),
)

export const queryGetUserQueries = Universal(
  (query) => () =>
    query<
      SAN.API.Query<
        'queries',
        (App.ApiQuery & { user: { id: number; username: string; avatarUrl?: string } })[]
      >
    >(`{
        queries:getUserQueries(page:1, pageSize:100) {
          ${QUERY_FRAGMENT}
          user { id username avatarUrl }
        }
      }`).then(({ queries }) => queries),
)
