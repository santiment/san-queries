import { ApiQuery } from 'san-webkit-next/api'

export type TAssetInfoData = {
  priceUsd: number
  marketcapUsd: number
  percentChange24h: string
  tags: { name: string }[]
  info: null | { summary: string }
  sentiment_positive_total: number
  sentiment_negative_total: number
}
export const queryAssetInfo = ApiQuery(
  (variables: { slug: string }) => ({
    schema: `query($slug: String!){
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
`,
    variables: {
      slug: variables.slug,
    },
  }),
  (gql: { data: TAssetInfoData }) => gql.data,
)
