import type { SS } from 'svelte-runes'

import { exhaustMap, filter, map, pipe, tap } from 'rxjs'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'

import { goto } from '$app/navigation'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { mutateDeleteSqlQuery } from '../api'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'

export function useQueryDeleteFlow(apiQuery: SS<undefined | App.ApiQuery>) {
  const editorSidebarCtx = useEditorSidebarCtx()

  const onDeleteClick = useObserveFnCall(() =>
    pipe(
      map(() => apiQuery.$),
      filter((apiQuery): apiQuery is App.ApiQuery => !!apiQuery),
      filter(() => confirm('Delete this query? This action cannot be undone')),
      exhaustMap((query) =>
        mutateDeleteSqlQuery()(query.id).pipe(
          tap(() => (apiQuery.$ = undefined)),
          tap(() => goto('/query/new')),
          tap(() =>
            notifications$.show({ type: 'info', title: 'Query deleted', dismissAfter: 5000 }),
          ),
          tap(() => editorSidebarCtx.emit.refreshQueries()),
        ),
      ),
    ),
  )

  return { onDeleteClick }
}
