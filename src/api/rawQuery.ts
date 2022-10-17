import { mutate } from 'webkit/api'

const RAW_CLICKHOUSE_QUERY_MUTATION = `
  mutation($query: String!, $parameters: json!="{}") {
    sql:computeRawClickhouseQuery(query:$query,parameters:$parameters) {
      headers:columns
      rows
      types:columnTypes
    }
  }`

type Query = SAN.API.Query<'sql', SAN.Queries.SQLResult>

function cacheModifier(data) {
  const { sql } = data

  data.sql.dateColumns = new Set<number>()
  sql.types.forEach((type, i) => {
    if (type.startsWith('Date')) sql.dateColumns.add(i)
  })

  return data
}
const precacher = () => cacheModifier

const accessor = ({ sql }) => sql
export const mutateComputeRawClickhouseQuery = (
  query: string,
  parameters?: { [key: string]: string | number },
  requestOptions?: SAN.API.RequestOptions,
) =>
  mutate<Query>(
    RAW_CLICKHOUSE_QUERY_MUTATION,
    {
      precacher,
      variables: {
        query,
        parameters: JSON.stringify(parameters),
      },
    },
    requestOptions,
  ).then(accessor) as Promise<SAN.Queries.SQLResult>
