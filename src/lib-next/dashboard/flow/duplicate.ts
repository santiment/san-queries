import {
  Observable,
  catchError,
  concatAll,
  defaultIfEmpty,
  delay,
  exhaustMap,
  filter,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  tap,
  toArray,
} from 'rxjs'

import { useObserveFnCall } from 'san-webkit-next/utils'
import { notification } from 'san-webkit-next/ui/core/Notifications'
import { getSEOLinkFromIdAndTitle } from 'san-webkit-next/utils/url'
import { goto } from '$app/navigation'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator'
import { mutateCreateDashboard, mutateUpdateDashboard } from '../api/save'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
import { useDashboardSerializeFlow, type TSerializedDashboard } from './save.svelte'
import { useDashboardSqlQueriesCtx } from '../ctx/dashboard-queries.svelte'
import { mutateCreateDashboardQuery } from '../sql-query/api'
import type { TDashboardKey, TDataWidgetKey } from '../types'
import { createStoreDashboardSqlCache$ } from '../sql-query/flow/cache'

function substituteDashboard(dashboardEditor: TSerializedDashboard) {
  let stringified = JSON.stringify({
    settings: dashboardEditor.settings,
  })

  const alias = {} as Record<string, undefined | string>

  return {
    replaceOldWidgetIds(oldToNewWidgetId: [string, string][]) {
      for (const [oldId, newId] of oldToNewWidgetId) {
        if (!oldId) continue

        alias[oldId] = newId
        stringified = stringified.replaceAll(oldId, newId)
      }
    },

    getNewWidgetId(oldId: string): null | string {
      return alias[oldId] ?? null
    },

    getSettings() {
      return JSON.parse(stringified).settings as TSerializedDashboard['settings']
    },
  }
}

export function useDashboardDuplicateFlow() {
  const saveIndicatorCtx = useSaveIndicatorCtx()
  const editorSidebarCtx = useEditorSidebarCtx()
  const { serializeDashboard } = useDashboardSerializeFlow()
  const { sqlQueryCachedData } = useDashboardSqlQueriesCtx.get()

  const duplicateDashboard = useObserveFnCall(() => {
    const createDuplicateQueries$ = (
      dashboardId: TDashboardKey,
      sqlQuries: TSerializedDashboard['sqlQueries'],
    ) =>
      forkJoin(
        sqlQuries.map((sqlQuery): Observable<[string, string]> => {
          return mutateCreateDashboardQuery()({ dashboardId, queryId: +sqlQuery.id }).pipe(
            // oldId, newId
            map((apiQuery) => [sqlQuery.dashboardQueryMappingId, apiQuery.dashboardQueryMappingId]),
          )
        }),
      ).pipe(defaultIfEmpty([]))

    return exhaustMap(() => {
      const dashboardEditor = serializeDashboard()
      const substituted = substituteDashboard(dashboardEditor)

      return of(dashboardEditor).pipe(
        filter((dashboardEditor) => !!dashboardEditor.id),
        tap(() => saveIndicatorCtx.emit.saving()),

        mergeMap(({ name, description = '' }) =>
          mutateCreateDashboard()({ name: '[Copy] ' + name, description }),
        ),

        mergeMap(({ id: dashboardId, name }) =>
          of(null).pipe(
            mergeMap(() => createDuplicateQueries$(dashboardId, dashboardEditor.sqlQueries)),
            map((oldToNewWidgetId) => substituted.replaceOldWidgetIds(oldToNewWidgetId)),

            mergeMap(() =>
              mutateUpdateDashboard()({ id: dashboardId, settings: substituted.getSettings() }),
            ),

            mergeMap(() =>
              from(
                Array.from(sqlQueryCachedData).map(([_key, data]) => ({
                  ...data,
                  dashboardQueryMappingId: substituted.getNewWidgetId(
                    data!.dashboardQueryMappingId,
                  ) as TDataWidgetKey,
                })),
              ).pipe(
                map((data) => createStoreDashboardSqlCache$(dashboardId, data)),
                concatAll(),
                toArray(),
              ),
            ),

            map(() => ({ id: dashboardId, name })),
          ),
        ),

        delay(1000),
        tap(() => saveIndicatorCtx.emit.success()),
        tap(({ id, name }) => goto('/dashboard/' + getSEOLinkFromIdAndTitle(id, name))),
        tap(() => notification.success('Dashboard duplicated!')),
        tap(() => editorSidebarCtx.emit.refreshDashboards()),

        catchError((e) =>
          of(null).pipe(
            tap(() => console.error(e)),
            tap(() => saveIndicatorCtx.emit.error()),
          ),
        ),
      )
    })
  })

  return { duplicateDashboard }
}
