import { ApiQuery } from 'san-webkit-next/api'

export type TAssetFoundersData = {
  founders: {
    metadata: {
      availableFounders: { name: string; project: { name: string } }[]
    }
  }
}
export const queryAssetFounders = ApiQuery(
  (variables: { slug: string }) => ({
    schema: `{
  founders:getMetric(metric: "social_volume_total") {
    metadata {
      availableFounders {
        name
        project {
          name
        }
      }
    }
  }
}`,
    variables: {
      slug: variables.slug,
    },
  }),
  (gql: TAssetFoundersData) => gql.founders.metadata.availableFounders,
)
