import { mutate } from 'webkit/api'

export function mutateDeleteSqlQuery(id: number | string) {
  return mutate<SAN.API.Query<'createSqlQuery', App.ApiQuery>>(
    `mutation {
    deleteSqlQuery(id:${id}) { id }
  }`,
  ).then(({ createSqlQuery }) => createSqlQuery)
}
