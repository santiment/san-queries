import { Fetcher } from '$lib/api'

export const QUERY_FRAGMENT = `id
      name
      description
      isPublic
      #createdAt # Cannot return null for non-nullable field
      settings
      sqlQueryParameters
      sqlQueryText
      dashboardQueryMappingId
      user { id username avatarUrl }
      `

export type TRawSqlData = App.SqlData & {
  clickhouseQueryId: string
  queryId?: number | string
}
export const queryRunRawSqlQuery = Fetcher(
  (variables: { sql: string; parameters?: null | Record<string, any> }) => ({
    schema: `query($sql: String!, $parameters: json!="{}") {
    data:runRawSqlQuery(sqlQueryText: $sql, sqlQueryParameters: $parameters) {
      rows
      columns
      columnTypes

      clickhouseQueryId
      queryId
      queryEndTime
      queryStartTime
      summary
    }
  }`,
    variables: {
      sql: variables.sql,
      parameters: variables.parameters ? JSON.stringify(variables.parameters) : undefined,
    },
  }),
  (gql: { data: TRawSqlData }) => gql.data,
)

export const queryGetCachedQueryExecutions = Fetcher(
  (queryId: number) =>
    `{
      data:getCachedQueryExecutions(queryId:${queryId}) {
        result {
          rows
          columns
          columnTypes

          clickhouseQueryId
          queryId

          #queryEndTime
          #queryStartTime
          summary
        }
      }
     }`,
  (gql: {
    data: {
      insertedAt: string
      isQueryHashMatching: boolean
      result: App.SqlData & {
        clickhouseQueryId: string
      }
    }[]
  }) => {
    // TODO: Remove after BE fix
    const cached = gql.data[0]?.result
    if (cached) {
      const now = new Date().toISOString()
      // @ts-expect-error
      cached.queryEndTime = cached.queryEndTime ?? now
      // @ts-expect-error
      cached.queryStartTime = cached.queryStartTime ?? now
    }

    return gql.data
  },
)

export const mutateCreateSqlQuery = Fetcher(
  (variables: {
    name: string
    description?: null | string

    sql: string
    parameters?: { key: string; value: any }[]

    isPublic?: boolean
    settings?: App.ApiQuerySettings
  }) => ({
    schema: `mutation createSqlQuery($name: String!, $description: String, $isPublic:Boolean, $settings: json, $sql: String, $parameters: json) {
      query:createSqlQuery(name:$name, description:$description, isPublic:$isPublic, sqlQueryText:$sql, sqlQueryParameters:$parameters, settings:$settings) {
        ${QUERY_FRAGMENT}
      }
  }`,
    variables: {
      ...variables,
      settings: JSON.stringify(variables.settings || {}),
      parameters: variables.parameters && serializeParameters(variables.parameters),
    },
  }),
  (gql: { query: App.ApiQuery }) => gql.query,
)
export function shareParameters(parameters: { key: string; value: unknown }[]) {
  return parameters.reduce(
    (acc, parameter) => {
      acc[parameter.key] = parameter.value
      return acc
    },
    {} as Record<string, any>,
  )
}
export function serializeParameters(parameters: { key: string; value: unknown }[]) {
  return JSON.stringify(shareParameters(parameters))
}

export const mutateDeleteSqlQuery = Fetcher(
  (queryId: number) => `mutation { deleteSqlQuery(id:${queryId}) { id } }`,
  (gql: { deleteSqlQuery: { id: number } }) => gql.deleteSqlQuery,
)

export const mutateUpdateSqlQuery = Fetcher(
  (
    variables: { id: number } & Partial<{
      name: string
      description: null | string

      sql: string
      parameters: { key: string; value: any }[]

      isPublic: boolean
      settings: App.ApiQuerySettings
    }>,
  ) => ({
    schema: `mutation updateSqlQuery($id: Int!, $name: String, $description: String, $isPublic:Boolean, $settings: json, $sql: String, $parameters: json) {
    query:updateSqlQuery(id:$id, name:$name, description:$description, isPublic:$isPublic, sqlQueryText:$sql, sqlQueryParameters:$parameters, settings:$settings) {
      ${QUERY_FRAGMENT}
    }
  }`,
    variables: {
      ...variables,

      settings: JSON.stringify(variables.settings || {}),
      parameters: variables.parameters && serializeParameters(variables.parameters),
    },
  }),
  (gql: { query: App.ApiQuery }) => gql.query,
)
