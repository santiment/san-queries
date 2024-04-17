import type QueryEditorSvelte from '../QueryEditor.svelte'

import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { catchError, debounceTime, delay, exhaustMap, filter, mergeMap, of, pipe, tap } from 'rxjs'
import { useObserve, type SS } from 'svelte-runes'
import { mutateCreateSqlQuery, mutateUpdateSqlQuery } from '../api'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
import { getPlaceholderName, replaceSeoLink } from '$lib/utils'
import { goto, preloadData, pushState, replaceState } from '$app/navigation'
import { gotoQueryPage } from '$routes/(editor)/query/[[slug]]/utils'

const createSave$ = (
  queryEditor: App.QueryEditor,
  saveIndicatorCtx: ReturnType<typeof useSaveIndicatorCtx>,
) =>
  of(queryEditor).pipe(
    filter((data): data is App.QueryEditor & { id: number } => !!data && !!data.id),
    tap(() => saveIndicatorCtx.emit.saving()),
    mergeMap((query) => mutateUpdateSqlQuery()(query)),
    tap((query) => replaceSeoLink('/query/', query.id, query.name)),

    delay(1500),
    tap(() => saveIndicatorCtx.emit.success()),

    catchError(() => of(null).pipe(tap(() => saveIndicatorCtx.emit.error()))),
  )

export function useSaveFlow(QueryEditorRef: SS<QueryEditorSvelte>, isAuthor: SS<boolean>) {
  const saveIndicatorCtx = useSaveIndicatorCtx()

  const saveQuery = useObserveFnCall(() =>
    pipe(
      filter(() => isAuthor.$),
      exhaustMap(() => createSave$(QueryEditorRef.$?.getState(), saveIndicatorCtx)),
    ),
  )

  return { saveQuery }
}

export function useSaveEmptyFlow(QueryEditorRef: SS<QueryEditorSvelte>) {
  const saveEmptyQuery = useObserveFnCall<(id: number) => void>(() =>
    pipe(
      exhaustMap((saveEditorState) =>
        mutateCreateSqlQuery()({
          name: getPlaceholderName(),
          sql: QueryEditorRef.$!.getState()!.sql,
          isPublic: true,
        }).pipe(
          tap((apiQuery) => saveEditorState(apiQuery.id)),
          tap(changePage),
        ),
      ),
    ),
  )

  return { saveEmptyQuery }
}

export function useAutoSaveFlow(QueryEditorRef: SS<QueryEditorSvelte>, isAuthor: SS<boolean>) {
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const saveIndicatorCtx = useSaveIndicatorCtx()

  useObserve(() =>
    changeIndicatorCtx.onChange$.pipe(
      filter(() => isAuthor.$),
      debounceTime(1500),
      exhaustMap(() => createSave$(QueryEditorRef.$?.getState(), saveIndicatorCtx)),
    ),
  )
}

function changePage(apiQuery: App.ApiQuery) {
  const href = '/query/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name)
  gotoQueryPage(href, { apiQuery })
}
