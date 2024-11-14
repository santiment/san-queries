import { createCtx, useObserveFnCall } from 'san-webkit-next/utils'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator'
import { useDashboardCtx } from '../ctx'
import { catchError, of, pipe, tap } from 'rxjs'
import type { TDashboardDocument } from '../types'
import type { TParsedDashboard } from '../parse'
import {
  serializeParameterWidget,
  useDashboardGlobalParametersCtx,
} from '../ctx/global-parameters.svelte'
import { serializeDataWidget, useDashboardDataWidgets } from '../ctx/data-widgets.svelte'

export const useDashboardSaveFlowCtx = createCtx('dashboards_useDashboardSaveFlow', () => {
  const saveIndicatorCtx = useSaveIndicatorCtx.get()

  const { dashboard, documentEditor } = useDashboardCtx.get()
  const { parameterWidgets } = useDashboardGlobalParametersCtx.get()
  const { dataWidgets } = useDashboardDataWidgets.get()

  const _ = useObserveFnCall(() =>
    pipe(
      tap(() => saveIndicatorCtx.emit.saving()),
      tap(),
      catchError(() => {
        return of(null)
      }),
    ),
  )

  function scheduleSave() {
    if (dashboard.isCurrentUserAuthor === false) return

    saveIndicatorCtx.emit.saving()

    serializeDashboard()
  }

  function serializeDashboard() {
    const { id, name, description } = dashboard.state.$$

    const editor = documentEditor.$
    let settings: undefined | Omit<TParsedDashboard, 'wasMigrated'>

    if (editor) {
      const usedIds = new Set<string>()
      const documentContent = editor.getJSON() as TDashboardDocument

      editor.state.doc.descendants((node) => {
        const id = node.attrs['data-id']
        if (id) usedIds.add(id)
      })

      console.log(usedIds)
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

    console.log({ settings })

    return {
      id,
      name: name || '',
      description: description || '',
    }
  }

  return {
    scheduleSave,
  }
})
