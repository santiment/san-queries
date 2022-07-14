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

function cacheModifier(data) {
  const { sql } = data
  const row = sql.rows[0]

  const dateColumns = [] as number[]
  row.forEach((value, i) => {
    const date = Date.parse(value)
    if (date > 0) dateColumns.push(i)
  })

  dateColumns.forEach((i) => {
    sql.rows.forEach((row) => {
      row[i] = Date.parse(row[i])
    })
  })

  data.sql.dateColumns = new Set(dateColumns)

  return data
}
const precacher = () => cacheModifier

const accessor = ({ sql }) => sql
export const mutateComputeRawClickhouseQuery = (variables: Variables) =>
  mutate<Query>(RAW_CLICKHOUSE_QUERY_MUTATION, { precacher, variables }).then(
    accessor,
  ) as Promise<SQLResult>
