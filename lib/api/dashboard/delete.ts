import { mutate } from 'san-webkit/lib/api'

const DELETE_DASHBOARD_MUTATION = (id: number) => `
  mutation {
    removeDashboard(id:${id}) {
      id
    }
  }`

export const mutateDeleteDashboard = (id: number) => mutate<any>(DELETE_DASHBOARD_MUTATION(id))
