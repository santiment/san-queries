import { Fetcher } from '$lib/api'

export const mutateStoreQueryExecution = Fetcher(
  (queryId: number | string, compressedData: string) => ({
    schema: `mutation ($queryId: Int!, $compressedData: String!) {
    storeQueryExecution(queryId:$queryId compressedQueryExecutionResult:$compressedData)
  }`,
    variables: { queryId, compressedData },
  }),
)
