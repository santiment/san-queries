import { exhaustMap, filter, pipe, tap } from 'rxjs'
import { ApiMutation } from 'san-webkit-next/api'
import { notification } from 'san-webkit-next/ui/core/Notifications'
import { useObserveFnCall } from 'san-webkit-next/utils'
import { goto } from '$app/navigation'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
import type { TDashboardKey } from '../types'

export const mutateDeleteDashboard = ApiMutation(
  (dashboardId: number) => `mutation { deleteDashboard(id:${dashboardId}) { id } }`,
  (gql: { deleteDashboard: { id: number } }) => gql.deleteDashboard,
)

export function useDashboardDeleteFlow() {
  const editorSidebarCtx = useEditorSidebarCtx()

  const deleteDashboard = useObserveFnCall<{ id: TDashboardKey }>(() =>
    pipe(
      filter(() => confirm('Delete this dashboard? This action cannot be undone')),
      exhaustMap(({ id }) =>
        mutateDeleteDashboard()(id as any).pipe(
          tap(() => goto('/dashboard/edit/new')),
          tap(() => notification.info('Dashboard deleted')),
          tap(() => editorSidebarCtx.emit.refreshDashboards()),
        ),
      ),
    ),
  )

  return { deleteDashboard }
}
