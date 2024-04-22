import type DashboardEditor from '$lib/Dashboard/Dashboard.svelte'

import {
  catchError,
  concat,
  debounceTime,
  delay,
  exhaustAll,
  exhaustMap,
  filter,
  finalize,
  forkJoin,
  from,
  map,
  merge,
  mergeMap,
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
import { mutateCreateDashboard } from '../save/api'
import { mutateAddDashboardGlobalParameter } from '$lib/Dashboard/GlobalParameters/api'
import { createAddGlobalParameterOverrides$ } from '$lib/Dashboard/GlobalParameters/flow'
import { mutateAddDashboardTextWidget, mutateCreateDashboardQuery } from '../widgets/api'

export function useDashboardDuplicateFlow(EditorRef: SS<DashboardEditor>) {
  const saveIndicatorCtx = useSaveIndicatorCtx()

  const onDuplicateClick = useObserveFnCall(() =>
    exhaustMap(() => {
      const dashboardEditor = EditorRef.$?.getState()
      const DuplicatedQueryMapping = {} as Record<string, string>
      console.log(dashboardEditor)
      console.log(DuplicatedQueryMapping)

      return of(dashboardEditor).pipe(
        filter((dashboardEditor) => !!dashboardEditor.id),
        tap(() => saveIndicatorCtx.emit.saving()),
        mergeMap(({ name, description = '', settings }) =>
          mutateCreateDashboard()({ name: '[Copy] ' + name, description, settings }),
        ),

        mergeMap(({ id: dashboardId, name }) =>
          of(null).pipe(
            mergeMap(() =>
              forkJoin(
                dashboardEditor.parameters.map((parameter) =>
                  mutateAddDashboardGlobalParameter()({
                    dashboardId,
                    key: parameter.key,
                    value: { string: parameter.value },
                  }),
                ),
              ),
            ),
            mergeMap(() =>
              forkJoin(
                dashboardEditor.widgets.map((widget) => {
                  if (widget.type === 'QUERY') {
                    return mutateCreateDashboardQuery()({
                      dashboardId,
                      queryId: +widget.query.id,
                    }).pipe(
                      tap(console.log),
                      tap(
                        (apiQueryWidget) =>
                          (DuplicatedQueryMapping[widget.id] =
                            apiQueryWidget.dashboardQueryMappingId),
                      ),
                    )
                  }

                  if (widget.type === 'TEXT') {
                    return mutateAddDashboardTextWidget()({
                      dashboardId,
                      body: widget.value || '',
                    })
                  }

                  return of(null)
                }),
              ),
            ),
            mergeMap(() =>
              forkJoin(
                dashboardEditor.parameters.map((parameter) =>
                  createAddGlobalParameterOverrides$(
                    dashboardId,
                    parameter.key,
                    Array.from(parameter.overrides.entries()).map((item) => [
                      DuplicatedQueryMapping[item[0]],
                      item[1],
                    ]),
                  ),
                ),
              ),
            ),

            tap((v) => console.log('widgets', v)),
            map(() => ({ id: dashboardId, name })),
          ),
        ),

        tap(({ id, name }) => goto('/dashboard/' + getSEOLinkFromIdAndTitle(id, name))),
        tap(() => saveIndicatorCtx.emit.success()),
        tap(() =>
          notifications$.show({
            type: 'success',
            title: 'Dashboard duplicated!',
            dismissAfter: 5000,
          }),
        ),

        catchError((e) =>
          of(null).pipe(
            tap(() => console.error(e)),
            tap(() => saveIndicatorCtx.emit.error()),
          ),
        ),
      )
    }),
  )

  return { onDuplicateClick }
}
