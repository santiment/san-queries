import { CachePolicy } from 'san-webkit/lib/api/cache'
import { Universal } from 'webkit/api'

export const QUERY_FRAGMENT = `id
      name
      description
      isPublic
      #createdAt # Cannot return null for non-nullable field
      settings
      sqlQueryParameters
      sqlQueryText
      dashboardQueryMappingId`

export const queryGetSqlQuery = Universal(
  (query) => (id: number) =>
    query<
      SAN.API.Query<
        'query',
        App.ApiQuery & { user: { id: number; username: string; avatarUrl?: string } }
      >
    >(
      `{
        query:getSqlQuery(id:${id}) {
          ${QUERY_FRAGMENT}
          user { id username avatarUrl }
        }
      }`,
      {
        cacheTime: 3,
      },
    ).then(({ query }) => query),
)

export const queryGetUserQueries = Universal(
  (query) =>
    (ignoreCache = false) =>
      query<
        SAN.API.Query<
          'queries',
          (App.ApiQuery & { user: { id: number; username: string; avatarUrl?: string } })[]
        >
      >(
        `{
        queries:getUserQueries(page:1, pageSize:100) {
          ${QUERY_FRAGMENT}
          user { id username avatarUrl }
        }
      }`,
        {
          cachePolicy: ignoreCache ? CachePolicy.NewCache : undefined,
        },
      ).then(({ queries }) => queries),
)

export const queryGetPublicQueries = Universal(
  (query) =>
    (ignoreCache = false) =>
      query<
        SAN.API.Query<
          'queries',
          (App.ApiQuery & { user: { id: number; username: string; avatarUrl?: string } })[]
        >
      >(
        `{
        queries:getPublicQueries(page:1, pageSize:100) {
          ${QUERY_FRAGMENT}
          user { id username avatarUrl }
        }
      }`,
        {
          cachePolicy: ignoreCache ? CachePolicy.NewCache : undefined,
        },
      ).then(({ queries }) => queries),
)
