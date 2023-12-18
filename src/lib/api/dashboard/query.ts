import { Universal, mutate } from 'webkit/api'

export async function compressQuery(json: any) {
  const stream = new Blob([JSON.stringify(json)], {
    type: 'application/json',
  }).stream()

  const compressedReadableStream = stream.pipeThrough(new window.CompressionStream('gzip'))

  const compressedResponse = new Response(compressedReadableStream)

  // Get response Blob
  const blob = await compressedResponse.blob()
  // Get the ArrayBuffer
  const buffer = await blob.arrayBuffer()

  // convert ArrayBuffer to base64 encoded string
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

export function mutateCompressedQueryExecutionResult(variables: {
  compressedQueryExecutionResult: string
  dashboardId: number
  dashboardQueryMappingId: string
}) {
  return mutate<any>(
    `mutation ($compressed: String!, $dashboardId: Int!, $dashboardQueryMappingId: String!) {
    dashboard:storeDashboardQueryExecution(compressedQueryExecutionResult: $compressed, dashboardId:$dashboardId, dashboardQueryMappingId:$dashboardQueryMappingId) {
      queries {queryId}
    }
  }`,
    { variables },
  )
}

export const queryGetCachedDashboardQueriesExecutions = Universal(
  (query) => (dashboardId: number) =>
    query<any>(
      `{
    data:getCachedDashboardQueriesExecutions(dashboardId:${dashboardId}) {
      queries{
        headers:columns
        rows
        types:columnTypes

        clickhouseQueryId
        queryId
        dashboardQueryMappingId
      }
    }
  }`,
      {
        cache: false,
      },
    ).then(({ data }) => data.queries),
)
