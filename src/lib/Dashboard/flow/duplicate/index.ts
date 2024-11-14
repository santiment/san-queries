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

import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'

import { goto } from '$app/navigation'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { mutateCreateDashboard, mutateUpdateDashboard } from '$lib-next/dashboard/api/save'
import { mutateAddDashboardGlobalParameter } from '$lib/Dashboard/GlobalParameters/api'
import { createAddGlobalParameterOverrides$ } from '$lib/Dashboard/GlobalParameters/flow'
import { mutateAddDashboardTextWidget, mutateCreateDashboardQuery } from '../widgets/api'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
import { mutateStoreDashboardQueryExecution } from '../sqlData/api'
import { compressData } from '$lib/utils/compress'
import {
  useDashboardSerializeFlow,
  type TSerializedDashboard,
} from '$lib-next/dashboard/flow/save.svelte'
import { useDashboardSqlQueriesCtx } from '$lib-next/dashboard/ctx/dashboard-queries.svelte'

function substituteDashboard(dashboardEditor: TSerializedDashboard) {
  let stringified = JSON.stringify({
    settings: dashboardEditor.settings,
    parameters: [],
    // parameters: dashboardEditor.parameters.map((parameter) => ({
    //   ...parameter,
    //   overrides: Array.from(parameter.overrides),
    // })),
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

    getParameters() {
      return []
      // type Parameter = App.DashboardEditor['parameters'][number]
      // return JSON.parse(stringified).parameters as (Parameter & { overrides: [string, string][] })[]
    },
  }
}

export function useDashboardDuplicateFlow() {
  const saveIndicatorCtx = useSaveIndicatorCtx()
  const editorSidebarCtx = useEditorSidebarCtx()
  const { serializeDashboard } = useDashboardSerializeFlow()
  const { sqlQueryCachedData } = useDashboardSqlQueriesCtx.get()

  const onDuplicateClick = useObserveFnCall(() => {
    const createDuplicateQueries$ = (
      dashboardId: number,
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

            // mergeMap(() =>
            //   forkJoin(
            //     dashboardEditor.parameters.map(({ key, value }) =>
            //       mutateAddDashboardGlobalParameter()({
            //         dashboardId,
            //         key,
            //         value: { [Array.isArray(value) ? 'stringList' : 'string']: value },
            //       }),
            //     ),
            //   ),
            // ),
            // mergeMap(() =>
            //   from(substituted.getParameters()).pipe(
            //     map(({ key, overrides }) =>
            //       createAddGlobalParameterOverrides$(dashboardId, key, overrides),
            //     ),
            //     concatAll(),
            //     toArray(),
            //   ),
            // ),

            mergeMap(() =>
              from(
                Array.from(sqlQueryCachedData).map(([key, data]) => ({
                  ...data,
                  dashboardQueryMappingId: substituted.getNewWidgetId(
                    data!.dashboardQueryMappingId,
                  )!,
                })),
              ).pipe(
                mergeMap((data) =>
                  from(
                    compressData(data).then(
                      (compressed) => [data.dashboardQueryMappingId, compressed] as const,
                    ),
                  ),
                ),
                map(([dashboardQueryMappingId, compressedData]) =>
                  mutateStoreDashboardQueryExecution()({
                    compressedData,
                    dashboardId,
                    dashboardQueryMappingId,
                  }).pipe(catchError(() => of(null))),
                ),
                concatAll(),
                toArray(),
              ),
            ),

            map(() => ({ id: dashboardId, name })),
          ),
        ),

        delay(1000),
        tap(() => saveIndicatorCtx.emit.success()),
        tap(({ id, name }) => goto('/dashboard-next/' + getSEOLinkFromIdAndTitle(id, name))),
        tap(() =>
          notifications$.show({
            type: 'success',
            title: 'Dashboard duplicated!',
            dismissAfter: 5000,
          }),
        ),
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

  return { onDuplicateClick }
}
