import { useDashboardParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { createCtx } from '$lib/ctx'
import { ss } from 'svelte-runes'

export const useDashboardEditorCtx = createCtx(
  'useDashboardEditorCtx',
  (apiDashboard?: App.ApiDashboard, isAuthor: boolean = false, readonly: boolean = false) => {
    const {
      id,
      name,
      description,
      isPublic,
      panels,
      queries = [],
      textWidgets = [],
    } = apiDashboard || {}

    const isLegacy = Boolean(panels?.length && !(queries.length || textWidgets.length))

    // useDashboardWidgets({ queries })
    const { parameters } = useDashboardParametersCtx(apiDashboard?.parameters)

    return {
      dashboardEditor: {
        isAuthor,
        readonly,

        id,
        name: ss(name || ''),
        description: ss(description || ''),
        isPublic: ss(isPublic),
        isLegacy,

        parameters,

        __editorJson: apiDashboard?.settings?.__editorJson,
      },
    }
  },
)
