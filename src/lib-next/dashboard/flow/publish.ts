import type { TDashboardKey } from '../types'
import { delay, exhaustMap, filter, pipe, tap } from 'rxjs'
import { useObserveFnCall } from 'san-webkit-next/utils'
import { notification } from 'san-webkit-next/ui/core/Notifications'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator'
import { mutateUpdateDashboard } from '../api/save'

export function usePublishToggleFlow() {
  const saveIndicatorCtx = useSaveIndicatorCtx.get()

  const publishDashboard = useObserveFnCall<{ id: TDashboardKey; onComplete: () => void }>(() =>
    pipe(
      filter(({ id }) => !!id),
      exhaustMap(({ id, onComplete }) =>
        mutateUpdateDashboard()({ id, isPublic: true }).pipe(tap(onComplete)),
      ),
    ),
  )

  const unpublishDashboard = useObserveFnCall<{ id: TDashboardKey; onComplete: () => void }>(() =>
    pipe(
      filter(({ id }) => !!id),
      tap(() => saveIndicatorCtx.emit.saving()),
      exhaustMap(({ id, onComplete }) =>
        mutateUpdateDashboard()({ id, isPublic: false }).pipe(
          delay(1000),
          tap(() => saveIndicatorCtx.emit.success()),
          tap(() => notification.info('Dashboard is now private')),
          tap(onComplete),
        ),
      ),
    ),
  )

  return { publishDashboard, unpublishDashboard }
}
