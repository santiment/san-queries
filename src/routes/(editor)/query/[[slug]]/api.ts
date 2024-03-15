import { Universal, mutate } from 'webkit/api'

export function mutateStoreQueryExecution(variables: { compressed: string; queryId: number }) {
  return mutate<any>(
    `mutation ($compressed: String!, $queryId: Int!) {
    storeQueryExecution(compressedQueryExecutionResult: $compressed, queryId:$queryId) 
  }`,
    { variables },
  )
}

export const queryGetCachedQueryExecutions = Universal(
  (query) => (queryId: number) =>
    query<any>(
      `{
    cache:getCachedQueryExecutions(queryId: ${queryId}) {
      result {
        headers:columns
        types:columnTypes
        rows
      }
      insertedAt
      isQueryHashMatching
      user {
        id
      }
    }
  }`,
      {
        cache: false,
      },
    ).then(({ cache }) => cache),
)
