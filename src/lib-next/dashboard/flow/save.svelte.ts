import type { TDashboardDocument } from '../types'
import type { TParsedDashboard } from '../parse'

import { exhaustMapWithTrailing } from 'rxjs-exhaustmap-with-trailing'
import { replaceState } from '$app/navigation'
import { page as page$ } from '$app/stores'
import { get } from 'svelte/store'
import { getSEOLinkFromIdAndTitle } from 'san-webkit-next/utils/url'
import { createCtx, useObserveFnCall } from 'san-webkit-next/utils'
import { getPlaceholderName } from '$lib/utils'
import { mutateCreateDashboard, mutateUpdateDashboard } from '../api/save'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator'
import { useDashboardCtx } from '../ctx'
import { catchError, debounceTime, delay, exhaustMap, map, mergeMap, of, pipe, tap } from 'rxjs'
import {
  serializeParameterWidget,
  useDashboardParameterWidgetsCtx,
} from '../ctx/parameter-widgets.svelte'
import { serializeDataWidget, useDashboardDataWidgets } from '../ctx/data-widgets.svelte'

export const useDashboardSaveFlowCtx = createCtx('dashboards_useDashboardSaveFlow', () => {
  const saveIndicatorCtx = useSaveIndicatorCtx.get()

  const dashboardCtx = useDashboardCtx.get()
  const { dashboard } = dashboardCtx

  const parameterWidgetsCtx = useDashboardParameterWidgetsCtx.get()
  const dataWidgetsCtx = useDashboardDataWidgets.get()

  const startDelayedSave = useObserveFnCall(() =>
    pipe(debounceTime(1500), exhaustMapWithTrailing(createSave$)),
  )

  const startQuickSave = useObserveFnCall(() => exhaustMap(createSave$))

  function createSave$() {
    const page = get(page$)
    return of(serializeDashboard(dashboardCtx, parameterWidgetsCtx, dataWidgetsCtx)).pipe(
      tap(() => saveIndicatorCtx.emit.saving()),

      tap((serialized) => {
        dashboard.state.$$.name = serialized.name
      }),

      mergeMap((serialized) => {
        return (serialized.id ? mutateUpdateDashboard : mutateCreateDashboard)()(serialized)
      }),

      map((apiDashboard) => {
        const { id, name } = apiDashboard

        dashboard.apiDashboard = apiDashboard
        dashboard.state.$$.id = id

        return (page.params.slug = getSEOLinkFromIdAndTitle(id, name))
      }),

      tap((slug) => {
        replaceState('/dashboard-next/edit/' + slug, page.state)
      }),

      delay(1500),
      tap(() => saveIndicatorCtx.emit.success()),

      catchError(() => {
        saveIndicatorCtx.emit.error()
        return of(null)
      }),
    )
  }

  function scheduleSave() {
    if (dashboard.isReadonly) return
    if (dashboard.isCurrentUserAuthor === false) return

    console.log('scheduled')

    if (dashboard.apiDashboard) {
      startDelayedSave()
    } else {
      startQuickSave()
    }
  }

  return {
    scheduleSave,
  }
})

export type TSerializedDashboard = ReturnType<typeof serializeDashboard>
function serializeDashboard(
  dashboardCtx: ReturnType<typeof useDashboardCtx>,
  parameterWidgetsCtx: ReturnType<typeof useDashboardParameterWidgetsCtx>,
  dataWidgetsCtx: ReturnType<typeof useDashboardDataWidgets>,
) {
  const { dashboard, documentEditor } = dashboardCtx
  const { parameterWidgets } = parameterWidgetsCtx
  const { dataWidgets } = dataWidgetsCtx

  const { id, name, description, isPublic } = dashboard.state.$$

  const editor = documentEditor.$
  let settings: undefined | Omit<TParsedDashboard, 'wasMigrated'>

  if (editor) {
    const usedIds = new Set<string>()
    const documentContent = editor.getJSON() as TDashboardDocument

    editor.state.doc.descendants((node) => {
      const id = node.attrs['data-id']
      if (id) usedIds.add(id)
    })

    const keepUsed = (item: { id: string }) => usedIds.has(item.id)

    settings = {
      version: 3,
      documentContent,
      parameterWidgets: parameterWidgets.$.filter(keepUsed).map((item) =>
        serializeParameterWidget(item, usedIds),
      ),
      dataWidgets: dataWidgets.$.filter(keepUsed).map(serializeDataWidget),
    }
  }

  return {
    id,
    isPublic,
    name: name || getPlaceholderName(),
    description: description || '',
    settings,
  }
}
