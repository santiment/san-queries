import { Map } from 'svelte/reactivity'
import {
  Subject,
  catchError,
  delay,
  exhaustMap,
  filter,
  from,
  groupBy,
  map,
  mergeMap,
  of,
  pipe,
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
import { queryGetCachedQueryExecutions, queryRunRawSqlQuery } from '$lib/QueryEditor/api'
import { compressData } from '$lib/utils/compress'
import { useDashboardParametersCtx } from '$lib/Dashboard/ctx/parameters'

const createSqlDataState = (
  initial: Partial<{ isLoading: boolean; default: null | App.SqlData }> = {},
) => ({
  isLoading: ss(initial.isLoading ?? true),
  defaultData: ss(initial.default || null),
  displayedData: ss(initial.default || null),
})

export const useDahboardSqlDataCtx = createCtx(
  'useDahboardSqlDataCtx',
  (dashboard?: App.ApiDashboard) => {
    const { dashboardEditor } = useDashboardEditorCtx()
    const { globalParameterOverrides } = useDashboardParametersCtx()

    let widgetParameterDefaults = Object.assign({}, globalParameterOverrides.$.widgetParams)

    function checkIsDefaultParamsChanged(widgetId: string, params: null | Record<string, any>) {
      if (!params) return false

      const defaultWidgetParams = widgetParameterDefaults[widgetId]

      for (const key in defaultWidgetParams) {
        if (defaultWidgetParams[key] !== params[key]) return true
      }

      return false
    }

    const addedSubject = new Subject<{ widgetId: string; queryId: number }>()
    const deletedSubject = new Subject<string>()

    const dashboardData = new Map(
      dashboard?.queries.map((query) => [query.dashboardQueryMappingId, createSqlDataState()]),
    )

    useObserve(() => {
      function setCacheData(CacheByWidgetId: Record<string, TDashboardSqlData>) {
        dashboardData.forEach((state, key) => {
          const data = CacheByWidgetId[key] || null
          state.isLoading.$ = false
          state.defaultData.$ = data
          state.displayedData.$ = data
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

    const refreshDashboardQueryData = useObserveFnCall<{
      dashboardId: number
      widgetId: string
      onComplete?: () => void
    }>(() =>
      pipe(
        groupBy(({ widgetId }) => widgetId),
        mergeMap((grouped) =>
          grouped.pipe(
            exhaustMap(({ dashboardId, widgetId, onComplete }) =>
              of(null).pipe(
                tap(() => (dashboardData.get(widgetId)!.isLoading.$ = true)),
                mergeMap(() => queryRunDashboardSqlQuery()(dashboardId, widgetId)),
                tap((data) => {
                  const state = dashboardData.get(widgetId)!
                  state.defaultData.$ = data
                  state.displayedData.$ = data
                  state.isLoading.$ = false
                }),
                mergeMap((data) => from(compressData(data))),
                mergeMap((compressedData) =>
                  mutateStoreDashboardQueryExecution()({
                    compressedData,
                    dashboardId,
                    dashboardQueryMappingId: widgetId,
                  }),
                ),

                tap(onComplete),
                catchError(() =>
                  of(null).pipe(tap(() => (dashboardData.get(widgetId)!.isLoading.$ = false))),
                ),
                takeUntil(deletedSubject.pipe(filter((deletedId) => deletedId === widgetId))),
              ),
            ),
          ),
        ),
      ),
    )

    const queryRawSql = useObserveFnCall<{
      widgetId: string
      sql: string
      parameters: null | Record<string, any>
      isDefault: boolean
      onComplete?: () => void
    }>(() =>
      pipe(
        groupBy(({ widgetId }) => widgetId),
        mergeMap((grouped) =>
          grouped.pipe(
            switchMap(({ widgetId, sql, parameters, isDefault, onComplete }) =>
              isDefault &&
              checkIsDefaultParamsChanged(widgetId, parameters) &&
              dashboardEditor.isAuthor
                ? of(null).pipe(
                    tap(() =>
                      refreshDashboardQueryData({
                        dashboardId: dashboardEditor.id!,
                        widgetId,
                        onComplete,
                      }),
                    ),
                  )
                : of(null).pipe(
                    tap(() => (dashboardData.get(widgetId)!.isLoading.$ = true)),
                    mergeMap(() =>
                      isDefault
                        ? of(dashboardData.get(widgetId)!.defaultData.$).pipe(delay(500))
                        : queryRunRawSqlQuery()({ sql, parameters }),
                    ),
                    tap((data) => {
                      const state = dashboardData.get(widgetId)!
                      state.displayedData.$ = data
                      state.isLoading.$ = false
                    }),
                    tap(onComplete),

                    catchError(() =>
                      of(null).pipe(tap(() => (dashboardData.get(widgetId)!.isLoading.$ = false))),
                    ),
                    takeUntil(deletedSubject.pipe(filter((deletedId) => deletedId === widgetId))),
                  ),
            ),
          ),
        ),
      ),
    )

    return {
      dashboardData,
      refreshDashboardQueryData,
      queryRawSql,

      emit: {
        queryAdded: (added: { widgetId: string; queryId: number }) => addedSubject.next(added),
        queryDeleted: (dashboardQueryMappingId: string) =>
          deletedSubject.next(dashboardQueryMappingId),
      },
    }
  },
)
