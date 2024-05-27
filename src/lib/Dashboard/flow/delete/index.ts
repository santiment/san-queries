import type { SS } from 'svelte-runes'

import { exhaustMap, filter, map, pipe, tap } from 'rxjs'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { goto } from '$app/navigation'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
import { mutateDeleteDashboard } from './api'

export function useDashboardDeleteFlow(apiDashboard: SS<undefined | App.ApiDashboard>) {
  const editorSidebarCtx = useEditorSidebarCtx()

  const onDeleteClick = useObserveFnCall(() =>
    pipe(
      map(() => apiDashboard.$),
      filter((apiDashboard): apiDashboard is App.ApiDashboard => !!apiDashboard),
      filter(() => confirm('Delete this dashboard? This action cannot be undone')),
      exhaustMap((dashboard) =>
        mutateDeleteDashboard()(dashboard.id).pipe(
          tap(() => (apiDashboard.$ = undefined)),
          tap(() => goto('/dashboard/edit/new')),
          tap(() =>
            notifications$.show({ type: 'info', title: 'Dashboard deleted', dismissAfter: 5000 }),
          ),
          tap(() => editorSidebarCtx.emit.refreshDashboards()),
        ),
      ),
    ),
  )

  return { onDeleteClick }
}
