import {
  catchError,
  debounceTime,
  delay,
  exhaustAll,
  exhaustMap,
  filter,
  map,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs'
import { ss, type SS } from 'svelte-runes'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'

import { goto } from '$app/navigation'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'

export function useDashboardDuplicateFlow(
  apiDashboard: SS<undefined | App.ApiDashboard>,
  QueryEditorRef: SS<any>,
) {
  const saveIndicatorCtx = useSaveIndicatorCtx()

  const onDuplicateClick = useObserveFnCall(
    () =>
      exhaustMap(() =>
        of(null).pipe(
          tap(() => saveIndicatorCtx.emit.saving()),
          tap(() =>
            notifications$.show({
              type: 'success',
              title: 'Dashboard duplicated!',
              dismissAfter: 5000,
            }),
          ),

          catchError(() => of(null).pipe(tap(() => saveIndicatorCtx.emit.error()))),
        ),
      ),

    /*
    pipe(
      debounceTime(200),
      filter(() => !!apiQuery.$),

      tap(() => saveIndicatorCtx.emit.saving()),
      map(() => QueryEditorRef.$?.getState()!),
      switchMap((queryEditor: App.QueryEditor) =>
        mutateCreateSqlQuery()({ ...queryEditor, name: '[Copy] ' + queryEditor.name }).pipe(
          delay(1000),

          tap(() => saveIndicatorCtx.emit.success()),
          tap((apiQuery) => goto('/query/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name))),
          tap(() =>
            notifications$.show({
              type: 'success',
              title: 'Query duplicated!',
              dismissAfter: 5000,
            }),
          ),

          catchError(() => of(null).pipe(tap(() => saveIndicatorCtx.emit.error()))),
        ),
      ),
    ),
    */
  )

  return { onDuplicateClick }
}
