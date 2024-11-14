import { delay, exhaustMap, filter, pipe, tap } from 'rxjs'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { mutateUpdateDashboard } from '$lib-next/dashboard/api/save'

export function useToggleDashboardPublicity() {
  const saveIndicatorCtx = useSaveIndicatorCtx()

  const publishDashboard = useObserveFnCall<{ dashboardId: number; onComplete: () => void }>(() =>
    pipe(
      filter(({ dashboardId }) => !!dashboardId),
      exhaustMap(({ dashboardId, onComplete }) =>
        mutateUpdateDashboard()({ id: dashboardId, isPublic: true }).pipe(tap(onComplete)),
      ),
    ),
  )

  const unpublishDashboard = useObserveFnCall<{ dashboardId: number; onComplete: () => void }>(() =>
    pipe(
      filter(({ dashboardId }) => !!dashboardId),
      tap(() => saveIndicatorCtx.emit.saving()),
      exhaustMap(({ dashboardId, onComplete }) =>
        mutateUpdateDashboard()({ id: dashboardId, isPublic: false }).pipe(
          delay(1000),
          tap(() => saveIndicatorCtx.emit.success()),
          tap(() =>
            notifications$.show({
              type: 'info',
              title: 'Dashboard is now private',
            }),
          ),
          tap(onComplete),
        ),
      ),
    ),
  )

  return { publishDashboard, unpublishDashboard }
}
