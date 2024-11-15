import { ApiQuery } from 'san-webkit-next/api'

export type TAsset = { slug: string; name: string; ticker: string; rank: null | number }
export const queryAllProjects = ApiQuery(
  () => `{
    allProjects{
      slug
      ticker
      name
      priceUsd
      infrastructure
      logoUrl
      rank
    }
  }`,
  (gql: { allProjects: TAsset[] }) =>
    gql.allProjects.sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999)),
  {
    cacheTime: undefined,
  },
)
