import { mutate } from 'san-webkit/lib/api';
const RAW_CLICKHOUSE_QUERY_MUTATION = `
  mutation($query: String!, $parameters: json!="{}") {
    sql:computeRawClickhouseQuery(query:$query,parameters:$parameters) {
      headers:columns
      rows
    }
  }`;
function cacheModifier(data) {
    const { sql } = data;
    const row = sql.rows[0];
    if (!row)
        return data;
    const dateColumns = [];
    row.forEach((value, i) => {
        if (typeof value !== 'string')
            return;
        const date = Date.parse(value);
        if (date > 0)
            dateColumns.push(i);
    });
    /*
    dateColumns.forEach((i) => {
      sql.rows.forEach((row) => {
        row[i] = Date.parse(row[i])
      })
    })
  */
    data.sql.dateColumns = new Set(dateColumns);
    return data;
}
const precacher = () => cacheModifier;
const accessor = ({ sql }) => sql;
export const mutateComputeRawClickhouseQuery = (query, parameters, requestOptions) => mutate(RAW_CLICKHOUSE_QUERY_MUTATION, {
    precacher,
    variables: {
        query,
        parameters: JSON.stringify(parameters),
    },
}, requestOptions).then(accessor);
//# sourceMappingURL=rawQuery.js.map