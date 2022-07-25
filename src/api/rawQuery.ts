import { mutate } from 'webkit/api'

const RAW_CLICKHOUSE_QUERY_MUTATION = `
  mutation($query: String!, $parameters: json!="{}") {
    sql:computeRawClickhouseQuery(query:$query,parameters:$parameters) {
      headers:columns
      rows
    }
  }`

type Query = SAN.API.Query<'sql', SAN.Queries.SQLResult>

function cacheModifier(data) {
  const { sql } = data
  const row = sql.rows[0]

  if (!row) return data

  const dateColumns = [] as number[]
  row.forEach((value, i) => {
    if (typeof value !== 'string') return

    const date = Date.parse(value)
    if (date > 0) dateColumns.push(i)
  })

  /* 
  dateColumns.forEach((i) => {
    sql.rows.forEach((row) => {
      row[i] = Date.parse(row[i])
    })
  })
*/

  data.sql.dateColumns = new Set(dateColumns)

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
