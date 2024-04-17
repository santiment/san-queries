import { useObserve, type SS } from 'svelte-runes'
import type DashboardEditor from '$lib/Dashboard/Dashboard.svelte'

import { catchError, debounceTime, delay, exhaustMap, filter, mergeMap, of, pipe, tap } from 'rxjs'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
import { mutateCreateDashboard, mutateUpdateDashboard } from './api'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
import { createCtx } from '$lib/ctx'
import { getPlaceholderName } from '$lib/utils'

const createSave$ = (
  dashboardEditor: undefined | App.DashboardEditor,
  saveIndicatorCtx: ReturnType<typeof useSaveIndicatorCtx>,
) =>
  of(dashboardEditor).pipe(
    filter(
      (data): data is App.DashboardEditor & { id: number } => !!data && !!data.id && !data.isLegacy,
    ),
    tap(() => saveIndicatorCtx.emit.saving()),
    mergeMap((dashboard) => mutateUpdateDashboard()(dashboard)),
    tap(replaceSeoLink),

    delay(1500),
    tap(() => saveIndicatorCtx.emit.success()),

    catchError(() => of(null).pipe(tap(() => saveIndicatorCtx.emit.error()))),
  )

export function useSaveFlow(EditorRef: SS<DashboardEditor>, isAuthor: SS<boolean>) {
  const saveIndicatorCtx = useSaveIndicatorCtx()

  const saveDashboard = useObserveFnCall(() =>
    pipe(
      filter(() => isAuthor.$),
      exhaustMap(() => createSave$(EditorRef.$?.getState(), saveIndicatorCtx)),
    ),
  )

  return { saveDashboard }
}

// TODO: Unify DashboardEditor and QueryEditor auto save flow
export function useAutoSaveFlow(EditorRef: SS<DashboardEditor>, isAuthor: SS<boolean>) {
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const saveIndicatorCtx = useSaveIndicatorCtx()

  useObserve(() =>
    changeIndicatorCtx.onChange$.pipe(
      filter(() => isAuthor.$),
      debounceTime(1500),
      exhaustMap(() => createSave$(EditorRef.$?.getState(), saveIndicatorCtx)),
    ),
  )
}

function replaceSeoLink(apiQuery: Pick<App.ApiDashboard, 'id' | 'name'>) {
  window.history.replaceState(
    history.state,
    '',
    '/dashboard/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name),
  )
}

export const useSaveEmptyFlowCtx = createCtx(
  'useSaveEmptyFlowCtx',
  (apiDashboard?: SS<undefined | App.ApiDashboard>) => {
    const saveEmptyDashboard = useObserveFnCall<{
      name?: string
      description?: string
      onComplete?: (apiDashboard: Pick<App.ApiDashboard, 'id'>) => void
    }>(() =>
      pipe(
        filter(() => !!apiDashboard && !apiDashboard.$),
        exhaustMap(({ name, description = '', onComplete }) =>
          mutateCreateDashboard()({
            name: name || getPlaceholderName(),
            description,
          }).pipe(
            tap((_apiDashboard) => (apiDashboard!.$ = _apiDashboard)),
            tap(replaceSeoLink),
            tap(onComplete),
          ),
        ),
      ),
    )

    function postponeAction(action: string) {
      window.NEW_DASHBOARD_POSTPONED = () => {
        delete window.NEW_DASHBOARD_POSTPONED
        return action
      }
    }

    const getPostponedAction = () => window.NEW_DASHBOARD_POSTPONED?.() || ''

    return { saveEmptyDashboard, postponeAction, getPostponedAction }
  },
)
