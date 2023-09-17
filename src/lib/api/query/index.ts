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
const SQL = `SELECT
  toStartOfMonth(dt) as month,
  min(total_active_market_cap) as low_total_active_market_cap,
  max(total_active_market_cap) as high_total_active_market_cap
FROM (  
SELECT
    dt,
    sum(active_market_cap) AS total_active_market_cap
    FROM
    (
        SELECT
            dt,
            asset_id,
            argMaxIf(value, computed_at, metric_id=dictGet('default.metrics_by_name','metric_id','daily_avg_price_usd')) AS daily_avg_price_usd,
            argMaxIf(value, computed_at, metric_id = dictGet('default.metrics_by_name','metric_id','stack_circulation_365d')) AS stack_circulation_365d,
            daily_avg_price_usd * stack_circulation_365d as active_market_cap
        FROM daily_metrics_v2
        WHERE dt>'2020-01-01' AND metric_id in (dictGet('default.metrics_by_name','metric_id','daily_avg_price_usd'),dictGet('default.metrics_by_name','metric_id','stack_circulation_365d'))
        
        GROUP BY asset_id, dt
        HAVING active_market_cap > 100000 AND active_market_cap < 1000000000000
    )
    GROUP BY dt
    ORDER BY dt
)
group by month
`

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
