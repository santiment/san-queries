import { mutate } from 'webkit/api'

export function mutateDeleteSqlQuery(id: number | string) {
  return mutate<SAN.API.Query<'deleteSqlQuery', { id: number }>>(
    `mutation {
    deleteSqlQuery(id:${id}) { id }
  }`,
  ).then(({ deleteSqlQuery }) => deleteSqlQuery)
}
