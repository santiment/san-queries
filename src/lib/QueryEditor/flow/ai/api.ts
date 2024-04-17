import { Fetcher } from '$lib/api'

export const queryGenerateTitleByQuery = Fetcher(
  (sql: string) => ({
    schema: `query($sql:String!){
  data:generateTitleByQuery(sqlQueryText:$sql) {
    title
    description
  }
}`,
    variables: { sql },
  }),
  (gql: { data: { title: string; description: string } }) => gql.data,
)
