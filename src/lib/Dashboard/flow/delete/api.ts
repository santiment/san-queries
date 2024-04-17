import { Fetcher } from '$lib/api'

export const mutateDeleteDashboard = Fetcher(
  (dashboardId: number) => `mutation { deleteDashboard(id:${dashboardId}) { id } }`,
  (gql: { deleteDashboard: { id: number } }) => gql.deleteDashboard,
)
