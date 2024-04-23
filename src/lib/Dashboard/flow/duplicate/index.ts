import type DashboardEditor from '$lib/Dashboard/Dashboard.svelte'

import {
  Observable,
  catchError,
  concat,
  delay,
  exhaustMap,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  tap,
  toArray,
} from 'rxjs'
import { type SS } from 'svelte-runes'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'

import { goto } from '$app/navigation'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { mutateCreateDashboard, mutateUpdateDashboard } from '../save/api'
import { mutateAddDashboardGlobalParameter } from '$lib/Dashboard/GlobalParameters/api'
import { createAddGlobalParameterOverrides$ } from '$lib/Dashboard/GlobalParameters/flow'
import { mutateAddDashboardTextWidget, mutateCreateDashboardQuery } from '../widgets/api'
import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'

function substituteDashboard(dashboardEditor: App.DashboardEditor) {
  let stringified = JSON.stringify({
    settings: dashboardEditor.settings,
    parameters: dashboardEditor.parameters.map((parameter) => ({
      ...parameter,
      overrides: Array.from(parameter.overrides),
    })),
  })

  return {
    replaceOldWidgetIds(oldToNewWidgetId: [string, string][]) {
      for (const [oldId, newId] of oldToNewWidgetId) {
        if (!oldId) continue
        stringified = stringified.replaceAll(oldId, newId)
      }
    },

    getSettings() {
      return JSON.parse(stringified).settings as App.DashboardEditor['settings']
    },

    getParameters() {
      type Parameter = App.DashboardEditor['parameters'][number]
      return JSON.parse(stringified).parameters as (Parameter & { overrides: [string, string][] })[]
    },
  }
}

export function useDashboardDuplicateFlow(EditorRef: SS<DashboardEditor>) {
  const saveIndicatorCtx = useSaveIndicatorCtx()
  const editorSidebarCtx = useEditorSidebarCtx()

  const onDuplicateClick = useObserveFnCall(() => {
    const createDuplicateWidgets$ = (
      dashboardId: number,
      widgets: (App.Dashboard.QueryWidget | App.Dashboard.TextWidget)[],
    ) =>
      forkJoin(
        widgets.map((widget): Observable<[string, string]> => {
          switch (widget.type) {
            case 'QUERY':
              return mutateCreateDashboardQuery()({ dashboardId, queryId: +widget.query.id }).pipe(
                map((apiQuery) => [widget.id, apiQuery.dashboardQueryMappingId]),
              )

            case 'TEXT':
              return mutateAddDashboardTextWidget()({ dashboardId, body: widget.value || '' }).pipe(
                map((apiWidget) => [widget.id, apiWidget.id]),
              )

            default:
              return of(['', ''])
          }
        }),
      )

    return exhaustMap(() => {
      const dashboardEditor = EditorRef.$?.getState()
      const substituted = substituteDashboard(dashboardEditor)

      return of(dashboardEditor).pipe(
        filter((dashboardEditor) => !!dashboardEditor.id),
        tap(() => saveIndicatorCtx.emit.saving()),

        mergeMap(({ name, description = '' }) =>
          mutateCreateDashboard()({ name: '[Copy] ' + name, description }),
        ),

        mergeMap(({ id: dashboardId, name }) =>
          of(null).pipe(
            mergeMap(() => createDuplicateWidgets$(dashboardId, dashboardEditor.widgets)),
            map((oldToNewWidgetId) => substituted.replaceOldWidgetIds(oldToNewWidgetId)),

            mergeMap(() =>
              mutateUpdateDashboard()({ id: dashboardId, settings: substituted.getSettings() }),
            ),

            mergeMap(() =>
              forkJoin(
                dashboardEditor.parameters.map(({ key, value }) =>
                  mutateAddDashboardGlobalParameter()({
                    dashboardId,
                    key,
                    value: { string: value },
                  }),
                ),
              ),
            ),
            map(() => substituted.getParameters()),

            mergeMap((parameters) =>
              concat(
                ...parameters.map(({ key, overrides }) =>
                  createAddGlobalParameterOverrides$(dashboardId, key, overrides),
                ),
              ).pipe(toArray()),
            ),

            map(() => ({ id: dashboardId, name })),
          ),
        ),

        delay(1000),
        tap(() => saveIndicatorCtx.emit.success()),
        tap(({ id, name }) => goto('/dashboard/' + getSEOLinkFromIdAndTitle(id, name))),
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
