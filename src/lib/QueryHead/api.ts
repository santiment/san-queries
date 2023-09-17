import { query } from 'webkit/api'

export const queryGenerateTitleBySql = (sql: string) =>
  query<
    SAN.API.Query<
      'data',
      {
        title: string
        description: string
      }
    >
  >(
    `query($sql: String!){
  data:generateTitleByQuery(sqlQueryText: $sql) {
    title
    description
  }
}`,
    { variables: { sql } },
  ).then(({ data }) => data)
