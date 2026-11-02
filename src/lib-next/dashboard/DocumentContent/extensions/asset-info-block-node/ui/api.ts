import { ApiQuery } from 'san-webkit-next/api'
import { internalProxyFetcher } from '../../utils/api'

export type TAssetInfoData = {
  priceUsd: number
  marketcapUsd: number
  percentChange24h: string
  tags: { name: string }[]
  info: null | { summary: string }
  sentiment_positive_total: number
  sentiment_negative_total: number
}

// Also on the /api/internal allowlist (src/routes/api/internal/allowed-queries.ts)
export const ASSET_INFO_QUERY = `query($slug: String!){
  data:projectBySlug(slug:$slug) {
    priceUsd
    marketcapUsd
    percentChange24h
    tags {
      name
    }
    info {
      summary
    }

    sentiment_positive_total: aggregatedTimeseriesData(aggregation:SUM, metric:"sentiment_positive_total",from:"utc_now-12h", to:"utc_now", includeIncompleteData: true)
    sentiment_negative_total: aggregatedTimeseriesData(aggregation:SUM, metric:"sentiment_negative_total",from:"utc_now-12h", to:"utc_now", includeIncompleteData: true)
  }
}
`

export const queryAssetInfo = ApiQuery(
  (variables: { slug: string }) => ({
    schema: ASSET_INFO_QUERY,
    variables: {
      slug: variables.slug,
    },
  }),
  (gql: { data: TAssetInfoData }) => gql.data,
  {
    fetcher: internalProxyFetcher,
  }
)
