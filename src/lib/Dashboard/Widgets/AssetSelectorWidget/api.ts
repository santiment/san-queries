import { Fetcher } from '$lib/api'

export const queryProjectBySlug = Fetcher(
  (slug: string) => `{
  data:projectBySlug(slug: "${slug}") {
    slug
    name
    ticker
    logoUrl
  }
}`,
  (gql: { data: { slug: string; name: string; ticker: string; logoUrl: string } }) => gql.data,
)
