import { createCtx } from 'san-webkit-next/utils'
import { useSaveIndicatorCtx } from '$lib/SaveIndicator'
import { useDashboardCtx } from '../ctx'

export const useDashboardSaveFlowCtx = createCtx('dashboards_useDashboardSaveFlow', () => {
  const saveIndicatorCtx = useSaveIndicatorCtx.get()

  const { dashboard, documentEditor } = useDashboardCtx.get()

  function scheduleSave() {
    saveIndicatorCtx.emit.saving()

    console.log(dashboard.state.$$)
    console.log(documentEditor.$)
  }

  return {
    scheduleSave,
  }
})
