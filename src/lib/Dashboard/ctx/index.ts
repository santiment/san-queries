import { ss } from 'svelte-runes'
import { createCtx } from '$lib/ctx'
import { DashboardSettingsSchema_v1, type TDashboardSettings } from './schema'
import { shareLayout, useDashboardLayoutCtx } from './layout'
import { useDashboardParametersCtx } from './parameters'
import { mapQueryWidget, mapTextWidget, parseWidgets, useDashboardWidgetsCtx } from './widgets'
import { parseDataFlowSettings, shareDataFlow } from './dataFlow'
import type { useDahboardSqlDataCtx } from '../flow/sqlData/index.svelte'

export const useDashboardEditorCtx = createCtx(
  'useDashboardEditorCtx',
  (apiDashboard?: App.ApiDashboard, isAuthor = false) => {
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

    const dataFlowSettings = parseDataFlowSettings(apiDashboard?.settings?.dataFlow)
    const { parameters } = useDashboardParametersCtx(apiDashboard?.parameters)
    const { widgets } = useDashboardWidgetsCtx(apiDashboard, dataFlowSettings)
    const { layout } = useDashboardLayoutCtx(widgets.$, settings.layout)

    return {
      dashboardEditor: {
        isAuthor,
        readonly: !isAuthor,

        id,
        name: ss(name || ''),
        description: ss(description || ''),
        isPublic: ss(isPublic),
        isLegacy,

        widgets,
        layout,

        parameters,

        dataFlowSettings,
        // settings: querySettingsCtx.settings,
        // parameters,
      },
    }
  },
)

export function unwrapState(
  dashboardEditor: ReturnType<typeof useDashboardEditorCtx>['dashboardEditor'],
  dataFlowCtx?: any,
  dashboardData?: ReturnType<typeof useDahboardSqlDataCtx>['dashboardData'],
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
      dataFlow: shareDataFlow(dataFlowCtx),
    },

    queriesData: Array.from(dashboardData?.values() || []).map((data) =>
      Object.assign({}, data.defaultData.$),
    ),
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
