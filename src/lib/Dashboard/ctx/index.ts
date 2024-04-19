import { ss } from 'svelte-runes'
import { createCtx } from '$lib/ctx'
import { DashboardSettingsSchema_v1, type TDashboardSettings } from './schema'
import { shareLayout, useDashboardLayoutCtx } from './layout'
import { useDashboardParametersCtx } from './parameters'
import { mapQueryWidget, mapTextWidget, parseWidgets, useDashboardWidgetsCtx } from './widgets'

export const useDashboardEditorCtx = createCtx(
  'useDashboardEditorCtx',
  (apiDashboard?: App.ApiDashboard) => {
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

    const settingsResult = DashboardSettingsSchema_v1.safeParse(apiDashboard?.settings)
    const settings = settingsResult.success ? settingsResult.data : { layout: [] }

    const { parameters } = useDashboardParametersCtx(apiDashboard?.parameters)
    const { widgets } = useDashboardWidgetsCtx(apiDashboard)
    const { layout } = useDashboardLayoutCtx(widgets.$, settings.layout)

    return {
      dashboardEditor: {
        id,
        name: ss(name || ''),
        description: ss(description || ''),
        isPublic: ss(isPublic),
        isLegacy,

        widgets,
        layout,

        parameters,
        // settings: querySettingsCtx.settings,
        // parameters,
      },
    }
  },
)

export function unwrapState(
  dashboardEditor: ReturnType<typeof useDashboardEditorCtx>['dashboardEditor'],
) {
  const { id, name, description, isPublic, widgets, layout, parameters, isLegacy } = dashboardEditor

  return {
    id,
    name: name.$,
    description: description.$,
    isPublic: isPublic.$,

    widgets: widgets.$,

    parameters: parameters.$,

    isLegacy,
    settings: {
      version: 2,
      layout: shareLayout(widgets.$, layout.$),
    },
  }
}

declare global {
  namespace App {
    type DashboardEditor = ReturnType<typeof unwrapState>

    namespace Dashboard {
      type TextWidget = ReturnType<typeof mapTextWidget>
      type QueryWidget = ReturnType<typeof mapQueryWidget>
      type ApiSettings = TDashboardSettings
    }
  }
}