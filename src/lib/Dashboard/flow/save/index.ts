import { useObserve, type SS } from 'svelte-runes'
import type DashboardEditor from '$lib/Dashboard/Dashboard.svelte'

import { catchError, debounceTime, delay, exhaustMap, filter, mergeMap, of, pipe, tap } from 'rxjs'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
import { mutateCreateDashboard, mutateUpdateDashboard } from './api'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
import { createCtx } from '$lib/ctx'
import { getPlaceholderName, replaceSeoLink } from '$lib/utils'
import { gotoDashboardPage } from '$routes/(editor)/dashboard/[[slug]]/utils'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
import { exhaustMapWithTrailing } from 'rxjs-exhaustmap-with-trailing'

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
    tap((dashboard) => replaceSeoLink('/dashboard/', dashboard.id, dashboard.name)),

    delay(1500),
    tap(() => saveIndicatorCtx.emit.success()),

    catchError(() => of(null).pipe(tap(() => saveIndicatorCtx.emit.error()))),
  )

export function useSaveFlow(EditorRef: SS<DashboardEditor>, isAuthor: SS<boolean>) {
  const saveIndicatorCtx = useSaveIndicatorCtx()

  const saveDashboard = useObserveFnCall(() =>
    pipe(
      filter(() => isAuthor.$),
      exhaustMapWithTrailing(() => createSave$(EditorRef.$?.getState(), saveIndicatorCtx)),
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
      exhaustMapWithTrailing(() => createSave$(EditorRef.$?.getState(), saveIndicatorCtx)),
    ),
  )
}

export const useSaveEmptyFlowCtx = createCtx(
  'useSaveEmptyFlowCtx',
  (apiDashboard?: SS<undefined | App.ApiDashboard>) => {
    const editorSidebarCtx = useEditorSidebarCtx()

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
            // tap((_apiDashboard) => (apiDashboard!.$ = _apiDashboard)),
            tap(changePage),
            tap(onComplete),
            tap(() => editorSidebarCtx.emit.refreshDashboards()),
          ),
        ),
      ),
    )

    // TODO: Maybe use sveltekit's history state ?
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

function changePage(apiDashboard: App.ApiDashboard) {
  const href = '/dashboard/' + getSEOLinkFromIdAndTitle(apiDashboard.id, apiDashboard.name)
  gotoDashboardPage(href, { apiDashboard })
}
