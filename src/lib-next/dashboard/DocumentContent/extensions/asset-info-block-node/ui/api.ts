import { ApiQuery } from 'san-webkit-next/api'

export type TAssetInfoData = {
  priceUsd: number
  marketcapUsd: number
  percentChange24h: string
  tags: { name: string }[]
  info: null | { summary: string }
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
  }
}
`,
    variables: {
      slug: variables.slug,
    },
  }),
  (gql: { data: TAssetInfoData }) => gql.data,
)
