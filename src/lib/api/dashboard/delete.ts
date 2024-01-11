import { mutate } from 'webkit/api'

export function mutateDeleteDashboard(id: number | string) {
  return mutate<SAN.API.Query<'deleteDashboard', { id: number }>>(
    `mutation {
    deleteDashboard(id:${id}) { id }
  }`,
  ).then(({ deleteDashboard }) => deleteDashboard)
}
