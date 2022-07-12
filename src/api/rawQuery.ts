import { mutate } from 'webkit/api'

const RAW_CLICKHOUSE_QUERY_MUTATION = `
  mutation {
    sql:computeRawClickhouseQuery(
      query: "SELECT * FROM intraday_metrics LIMIT 20",
      parameters: "{}") {
      columns,
      rows,
    }
  }`

type Variables = {
  query: string
  parameters: { [key: string]: string | number }
}
export const mutateComputeRawClickhouseQuery = (variables: Variables) =>
  mutate(RAW_CLICKHOUSE_QUERY_MUTATION, { variables })
