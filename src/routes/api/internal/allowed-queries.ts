import { ASSET_INFO_QUERY } from '$lib-next/dashboard/DocumentContent/extensions/asset-info-block-node/ui/api'

// The query san-webkit-next's chart sends for every metric of a sanbase-chart widget
// (`queryGetMetric` in ui/app/Chart/api). The library does not export the text, so this
// is a copy: if a san-webkit-next upgrade changes it, dashboard charts get 400 from
// /api/internal until it is updated here.
const GET_METRIC_QUERY = `
  query getMetric(
    $metric: String!
    $from: DateTime!
    $to: DateTime!
    $interval: interval
    $transform: TimeseriesMetricTransformInputObject
    $aggregation: Aggregation
    $includeIncompleteData: Boolean = true
    $selector: MetricTargetSelectorInputObject
  ) {
    getMetric(metric: $metric) {
      timeseriesDataJson(
        selector: $selector
        from: $from
        to: $to
        interval: $interval
        transform: $transform
        aggregation: $aggregation
        includeIncompleteData: $includeIncompleteData
        fields: {datetime: "d" value: "v" }
      )
    }
  }
`

const normalize = (query: string) => query.replace(/\s+/g, ' ').trim()

const ALLOWED_QUERIES = new Map(
  [GET_METRIC_QUERY, ASSET_INFO_QUERY].map((query) => [normalize(query), query] as const),
)

/**
 * The dashboard widgets' queries are the only ones /api/internal forwards. Returns this
 * module's own copy of `query` when it is one of them (whitespace aside), else `undefined`.
 */
export function findAllowedQuery(query: string) {
  return ALLOWED_QUERIES.get(normalize(query))
}
