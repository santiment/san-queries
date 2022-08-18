import { mutate } from 'san-webkit/lib/api';
const DELETE_DASHBOARD_MUTATION = (id) => `
  mutation {
    removeDashboard(id:${id}) {
      id
    }
  }`;
export const mutateDeleteDashboard = (id) => mutate(DELETE_DASHBOARD_MUTATION(id));
//# sourceMappingURL=delete.js.map