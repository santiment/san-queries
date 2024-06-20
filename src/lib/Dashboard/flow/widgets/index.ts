import { exhaustMap, switchMap, tap } from 'rxjs'
import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { useDashboardWidgetsCtx } from '$lib/Dashboard/ctx/widgets'
import { useDashboardLayoutCtx } from '$lib/Dashboard/ctx/layout'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
import {
  mutateAddDashboardTextWidget,
  mutateCreateDashboardQuery,
  mutateDeleteDashboardQuery,
  mutateDeleteDashboardTextWidget,
  mutateUpdateDashboardTextWidget,
} from './api'
import { useDahboardSqlDataCtx } from '../sqlData/index.svelte'
import { pipeGroupBy } from '$lib/utils'

export function useAddQueryToDashboardFlow() {
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const dahboardSqlDataCtx = useDahboardSqlDataCtx()
  const { addWidget } = useDashboardWidgetsCtx()
  const { addItem } = useDashboardLayoutCtx()

  const addQueryToDashboard = useObserveFnCall<{
    dashboardId: number
    queryId: number
    onComplete?: () => void
  }>(() =>
    exhaustMap(({ dashboardId, queryId, onComplete }) =>
      mutateCreateDashboardQuery()({ dashboardId: +dashboardId, queryId: +queryId }).pipe(
        tap(onComplete),
        tap((apiQuery) => addItem(addWidget('QUERY', apiQuery))),

        tap((apiQuery) =>
          dahboardSqlDataCtx.emit.queryAdded({
            widgetId: apiQuery.dashboardQueryMappingId,
            queryId: apiQuery.id,
          }),
        ),
        tap(() => changeIndicatorCtx.emit.changed()),
      ),
    ),
  )

  return { addQueryToDashboard }
}

export function useDeleteDashboardQueryFlow() {
  // const changeIndicatorCtx = useChangeIndicatorCtx()
  const dahboardSqlDataCtx = useDahboardSqlDataCtx()
  // const { removeWidget } = useDashboardWidgetsCtx()
  // const { removeItem } = useDashboardLayoutCtx()

  const deleteDashboardQuery = useObserveFnCall<{
    dashboardId: number
    widget: App.Dashboard.QueryWidget
  }>(() =>
    pipeGroupBy(
      ({ widget }) => widget.id,
      exhaustMap(({ dashboardId, widget }) =>
        mutateDeleteDashboardQuery()({ dashboardId, dashboardQueryMappingId: widget.id }).pipe(
          tap(() => dahboardSqlDataCtx.emit.queryDeleted(widget.id)),
        ),
      ),
    ),
  )

  // const deleteDashboardQuery = useObserveFnCall<{
  //   dashboardId: number
  //   widget: App.Dashboard.QueryWidget
  // }>(() =>
  //   pipe(
  //     groupBy(({ widget }) => widget.id),
  //     mergeMap((grouped) =>
  //       grouped.pipe(
  //         exhaustMap(({ dashboardId, widget }) =>
  //           mutateDeleteDashboardQuery()({ dashboardId, dashboardQueryMappingId: widget.id }).pipe(
  //             // tap(() => removeItem(removeWidget(widget))),
  //             tap(() => dahboardSqlDataCtx.emit.queryDeleted(widget.id)),
  //             // tap(() => changeIndicatorCtx.emit.changed()),
  //           ),
  //         ),
  //       ),
  //     ),
  //   ),
  // )

  return { deleteDashboardQuery }
}

// ----
export function useAddTextWidgetToDashboardFlow() {
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const { addWidget } = useDashboardWidgetsCtx()
  const { addItem } = useDashboardLayoutCtx()

  const addTextWidgetToDashboard = useObserveFnCall<{
    dashboardId: number
    body?: string
  }>(() =>
    exhaustMap(({ dashboardId, body }) =>
      mutateAddDashboardTextWidget()({ dashboardId: +dashboardId, body }).pipe(
        tap((textWidget) => addItem(addWidget('TEXT', textWidget))),

        tap(() => changeIndicatorCtx.emit.changed()),
      ),
    ),
  )

  return { addTextWidgetToDashboard }
}

export function useUpdateDashboardTextWidget() {
  const changeIndicatorCtx = useChangeIndicatorCtx()

  const updateDashboardTextWidget = useObserveFnCall<{
    textWidgetId: string
    dashboardId: number
    value: string
  }>(() =>
    switchMap(({ textWidgetId, dashboardId, value }) =>
      mutateUpdateDashboardTextWidget()({ dashboardId: +dashboardId, textWidgetId, value }).pipe(
        tap(() => changeIndicatorCtx.emit.changed()),
      ),
    ),
  )

  return { updateDashboardTextWidget }
}

export function useDeleteDashboardTextWidgetFlow() {
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const { removeWidget } = useDashboardWidgetsCtx()
  const { removeItem } = useDashboardLayoutCtx()

  const deleteDashboardTextWidget = useObserveFnCall<{
    dashboardId: number
    widget: App.Dashboard.TextWidget
  }>(() =>
    exhaustMap(({ dashboardId, widget }) =>
      mutateDeleteDashboardTextWidget()({ dashboardId, textWidgetId: widget.id }).pipe(
        tap(() => removeItem(removeWidget(widget))),
        tap(() => changeIndicatorCtx.emit.changed()),
      ),
    ),
  )

  return { deleteDashboardTextWidget }
}
