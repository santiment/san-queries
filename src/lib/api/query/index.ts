import { Universal } from 'webkit/api'

// const SQL = `WITH
// 	'2023-01-01' AS start_date,
// 	'2023-05-27' AS end_date,
// 	'pepe' AS asset,
// 	whales AS
// 	(
// 		SELECT address
// 		FROM current_label_addresses
// 		WHERE label_id IN (SELECT label_id FROM label_metadata WHERE (key = 'whale') AND (asset_name = asset))
// 	)
// SELECT
// 	to AS address,
// 	count(*) AS buying_transaction_count,
// 	max(dt) AS last_transaction_dt
// FROM erc20_transfers
// WHERE assetRefId = (dictGet('assets_by_name', 'asset_ref_id', asset))
// AND dt >= start_date AND dt < end_date
// AND to IN (SELECT * FROM whales)
// GROUP BY to
// LIMIT 10`
//
const SQL = ``

type VariablesType = {
  sql: string
  parameters: string // Record<string, string | number>
}

type ComputeRawClickhouseQuery = SAN.API.Query<'data', App.SqlData>

export const queryComputeRawClickhouseQuery = Universal(
  (query) =>
    (variables = { sql: SQL } as VariablesType) =>
      query<ComputeRawClickhouseQuery>(
        `query($sql: String!, $parameters: json!="{}") {
    data:runRawSqlQuery(sqlQueryText: $sql, sqlQueryParameters: $parameters) {
      headers:columns
      rows
      types:columnTypes

      clickhouseQueryId
      queryId
    }
  }`,
        { variables },
      ).then(({ data }) => data),
)

type QueryExecutionStats = {
  creditsCost: number
  readGb: number
  readRows: number
  insertedAt: number
  queryDurationMs: number
}

export const queryExecutionStats = Universal(
  (query) => (clickhouseQueryId: string) =>
    query<SAN.API.Query<'data', QueryExecutionStats>>(
      `{
          data:getClickhouseQueryExecutionStats(clickhouseQueryId:"${clickhouseQueryId}") {
            creditsCost
            readGb
            readRows
            insertedAt
            queryDurationMs
          }
        }`,
    ).then(({ data }) => data),
)

export const queryRunDashboardSqlQuery = Universal(
  (query) => (dashboardId: number, dashboardQueryMappingId: string) =>
    query<ComputeRawClickhouseQuery>(
      `{
    data:runDashboardSqlQuery(dashboardId:${dashboardId}, dashboardQueryMappingId:"${dashboardQueryMappingId}") {
      headers:columns
      rows
      types:columnTypes

      clickhouseQueryId
      queryId
      dashboardQueryMappingId
      queryEndTime
      queryStartTime
      summary
    }
  }`,
      {
        cache: false,
      },
    ).then(({ data }) => data),
)

declare global {
  namespace App {
    type SqlData = {
      headers: string[]
      rows: (string | number | null)[][]
      types: string[]

      clickhouseQueryId?: string
      queryId?: number | number
    }

    type SqlError = {
      date: string
      details: string
      old?: boolean
    }

    type Parameter = { key: string; value: string; global?: boolean }
  }
}
