import { createCtx } from '$lib/ctx'
import { Subject } from 'rxjs'

export const useEditorSidebarCtx = createCtx('useEditorSidebarCtx', () => {
  const refreshDashboardsSubject = new Subject<undefined>()
  const refreshQueriesSubject = new Subject<undefined>()

  return {
    emit: {
      refreshDashboards: () => refreshDashboardsSubject.next(undefined),
      refreshQueries: () => refreshQueriesSubject.next(undefined),
    },
    refreshDashboards$: refreshDashboardsSubject,
    refreshQueries$: refreshQueriesSubject,
  }
})
