import { mutate } from 'webkit/api'

const RAW_CLICKHOUSE_QUERY_MUTATION = `
  mutation($query: String!, $parameters: json!="{}") {
    sql:computeRawClickhouseQuery(query:$query,parameters:$parameters) {
      headers:columns
      rows
    }
  }`

type SQLResult = {
  columns: string[]
  rows: { [column: string]: any }[]
}
type Query = SAN.API.Query<'sql', SQLResult>

type Variables = {
  query: string
  parameters?: { [key: string]: string | number }
}

const accessor = ({ sql }) => sql
export const mutateComputeRawClickhouseQuery = (variables: Variables) =>
  mutate<Query>(RAW_CLICKHOUSE_QUERY_MUTATION, { variables }).then(accessor) as Promise<SQLResult>
