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
  parameters: {}
}

type ComputeRawClickhouseQuery = SAN.API.Query<'data', App.SqlData>

export const queryComputeRawClickhouseQuery = Universal(
  (query) =>
    (variables = { sql: SQL } as VariablesType) =>
      query<ComputeRawClickhouseQuery>(
        `query($sql: String!, $parameters: json!="{}") {
    data:computeRawClickhouseQuery(query:$sql,parameters:$parameters) {
      headers:columns
      rows
      types:columnTypes
    }
  }`,
        { variables },
      ).then(({ data }) => data),
)

declare global {
  namespace App {
    type SqlData = {
      headers: string[]
      rows: (string | number | null)[][]
      types: string[]
    }
  }
}
