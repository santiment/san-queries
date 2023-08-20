import { Universal } from "webkit/api";

type ClickhouseMetadataQuery = SAN.API.Query<'data', {
  tables: {n: string}[]
}>

export const queryClickhouseMetadata = Universal(query => () => query<ClickhouseMetadataQuery >(`{
  data:getClickhouseDatabaseMetadata {
    functions {n: name}
    tables {n: name}
    columns {n:name ta:table ty:type}
  }
}`).then(({data}) => data)
                                                )

