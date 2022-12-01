import { mutate } from 'san-webkit/lib/api';
export const PANEL_DATA_FRAGMENT = `
  headers:columns
  rows
  types:columnTypes
`;
const RAW_CLICKHOUSE_QUERY_MUTATION = `
  mutation($query: String!, $parameters: json!="{}") {
    sql:computeRawClickhouseQuery(query:$query,parameters:$parameters) {
      ${PANEL_DATA_FRAGMENT}
    }
  }`;
function cacheModifier(data) {
    const { sql } = data;
    data.sql.dateColumns = new Set();
    sql.types.forEach((type, i) => {
        if (type.startsWith('Date'))
            sql.dateColumns.add(i);
    });
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
//# sourceMappingURL=raw.js.map