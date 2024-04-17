import { Fetcher } from '$lib/api'

export type ExecutionStatsType = {
  creditsCost: number
  readGb: number
  readRows: number
  insertedAt: string
  queryDurationMs: number
}

export const queryGetClickhouseQueryExecutionStats = Fetcher(
  (clickhouseQueryId: string) => `{
      data:getClickhouseQueryExecutionStats(clickhouseQueryId:"${clickhouseQueryId}") {
        creditsCost
        readGb
        readRows
        insertedAt
        queryDurationMs
  }
}`,
  (gql: { data: ExecutionStatsType }) => gql.data,
)

declare global {
  namespace App {
    type ExecutionStats = ExecutionStatsType & { id?: string }
  }
}
