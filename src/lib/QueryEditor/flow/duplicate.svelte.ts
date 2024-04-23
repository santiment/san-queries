import QueryEditor from '$lib/QueryEditor/QueryEditor.svelte'

import { catchError, debounceTime, delay, filter, map, of, pipe, switchMap, tap } from 'rxjs'
import { ss, type SS } from 'svelte-runes'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'

import { goto } from '$app/navigation'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { mutateCreateSqlQuery } from '../api'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'

export function useQueryDuplicateFlow(
  apiQuery: SS<undefined | App.ApiQuery>,
  QueryEditorRef: SS<QueryEditor>,
) {
  const saveIndicatorCtx = useSaveIndicatorCtx()
  const editorSidebarCtx = useEditorSidebarCtx()

  let isDuplicating = ss(false)

  const onDuplicateClick = useObserveFnCall(() =>
    pipe(
      debounceTime(200),
      filter(() => !!apiQuery.$ && !isDuplicating.$),
      tap(() => (isDuplicating.$ = true)),
      tap(() => saveIndicatorCtx.emit.saving()),
      map(() => QueryEditorRef.$?.getState()!),
      switchMap((queryEditor: App.QueryEditor) =>
        mutateCreateSqlQuery()({ ...queryEditor, name: '[Copy] ' + queryEditor.name }).pipe(
          delay(1000),
          tap(() => (isDuplicating.$ = false)),
          tap(() => saveIndicatorCtx.emit.success()),
          tap((apiQuery) => goto('/query/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name))),
          tap(() =>
            notifications$.show({
              type: 'success',
              title: 'Query duplicated!',
              dismissAfter: 5000,
            }),
          ),
          tap(() => editorSidebarCtx.emit.refreshQueries()),

          catchError(() =>
            of(null).pipe(
              tap(() => (isDuplicating.$ = false)),
              tap(() => saveIndicatorCtx.emit.error()),
            ),
          ),
        ),
      ),
    ),
  )

  return { onDuplicateClick }
}
