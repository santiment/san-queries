import { Universal } from 'webkit/api'

const QUERY_FRAGMENT = `id
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
