import { Map } from 'svelte/reactivity'
import {
  Subject,
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
  scan,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import {
  mutateStoreDashboardQueryExecution,
  queryGetCachedDashboardQueriesExecutions,
  queryRunDashboardSqlQuery,
  type TDashboardSqlData,
} from './api'
import { createCtx } from '$lib/ctx'
import { ss, useObserve } from 'svelte-runes'

import { useDashboardEditorCtx } from '$lib/Dashboard/ctx'
import { queryGetCachedQueryExecutions } from '$lib/QueryEditor/api'
import { compressData } from '$lib/utils/compress'

const createSqlDataState = (
  initial: Partial<{ isLoading: boolean; default: null | App.SqlData }> = {},
) => ({
  isLoading: ss(initial.isLoading ?? true),
  default: ss(initial.default || null),
})

export const useDahboardSqlDataCtx = createCtx(
  'useDahboardSqlDataCtx',
  (dashboard?: App.ApiDashboard) => {
    const { dashboardEditor } = useDashboardEditorCtx()

    const addedSubject = new Subject<{ widgetId: string; queryId: number }>()
    const deletedSubject = new Subject<string>()

    const dashboardData = new Map(
      dashboard?.queries.map((query) => [query.dashboardQueryMappingId, createSqlDataState()]),
    )

    useObserve(() => {
      function setCacheData(CacheByWidgetId: Record<string, TDashboardSqlData>) {
        dashboardData.forEach((state, key) => {
          state.isLoading.$ = false
          state.default.$ = CacheByWidgetId[key] || null
        })
      }

      const scanCache$ = scan(
        (acc, value: TDashboardSqlData) =>
          Object.assign(acc, { [value.dashboardQueryMappingId]: value }),
        {} as Record<string, TDashboardSqlData>,
      )

      return of(dashboard).pipe(
        filter((data): data is App.ApiDashboard => !!data?.id),
        switchMap(({ id }) => queryGetCachedDashboardQueriesExecutions()(id)),
        switchMap((cache) => (cache.length ? from(cache).pipe(scanCache$) : of({}))),
        tap(setCacheData),
      )
    })

    useObserve(() =>
      addedSubject.pipe(
        mergeMap((added) =>
          of(added).pipe(
            switchMap((added) => queryGetCachedQueryExecutions()(added.queryId)),
            map((cache) => (cache[0] ? cache[0].result : undefined)),
            tap((cache) =>
              dashboardData.set(
                added.widgetId,
                createSqlDataState({ isLoading: false, default: cache }),
              ),
            ),
            filter((cache): cache is App.SqlData & { clickhouseQueryId: string } => !!cache),
            switchMap((cache) => from(compressData(cache))),
            switchMap((compressedData) =>
              mutateStoreDashboardQueryExecution()({
                compressedData,
                dashboardId: dashboard!.id,
                dashboardQueryMappingId: added.widgetId,
              }),
            ),
            takeUntil(deletedSubject.pipe(filter((deletedId) => deletedId === added.widgetId))),
          ),
        ),
      ),
    )

    const refreshDashboardQueryData = useObserveFnCall<{ dashboardId: number; widgetId: string }>(
      () =>
        mergeMap(({ dashboardId, widgetId }) =>
          of(widgetId).pipe(
            tap(() => (dashboardData.get(widgetId)!.isLoading.$ = true)),
            switchMap(() => queryRunDashboardSqlQuery()(dashboardId, widgetId)),
            tap((data) => {
              const state = dashboardData.get(widgetId)!
              state.default.$ = data
              state.isLoading.$ = false
            }),
            switchMap((data) => from(compressData(data))),
            switchMap((compressedData) =>
              mutateStoreDashboardQueryExecution()({
                compressedData,
                dashboardId,
                dashboardQueryMappingId: widgetId,
              }),
            ),
            catchError(() =>
              of(null).pipe(tap(() => (dashboardData.get(widgetId)!.isLoading.$ = false))),
            ),
            takeUntil(deletedSubject.pipe(filter((deletedId) => deletedId === widgetId))),
          ),
        ),
    )

    return {
      dashboardData,
      refreshDashboardQueryData,
      emit: {
        queryAdded: (added: { widgetId: string; queryId: number }) => addedSubject.next(added),
        queryDeleted: (dashboardQueryMappingId: string) =>
          deletedSubject.next(dashboardQueryMappingId),
      },
    }
  },
)
