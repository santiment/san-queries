import { Fetcher } from '$lib/api'

export const queryClickhouseMetadata = Fetcher(
  () => `{
  data:getClickhouseDatabaseMetadata {
    functions {n: name}
    tables {n: name}
    columns {n:name ta:table ty:type}
  }
}`,
  (gql: { data: { tables: { n: string }[] } }) => gql.data,
)
