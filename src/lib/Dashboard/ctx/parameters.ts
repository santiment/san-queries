import { Map } from 'svelte/reactivity'
import { ss, ssd } from 'svelte-runes'
import { createCtx } from '$lib/ctx'

export const useDashboardParametersCtx = createCtx(
  'useDashboardParametersCtx',
  (apiParameters?: App.ApiDashboard['parameters']) => {
    const parameters = ss(apiParameters ? parseParameters(apiParameters) : [])

    const globalParameterOverrides = ssd(() => {
      const map = new Map(
        parameters.$.flatMap((parameter) =>
          [...parameter.overrides.entries()].map(([widgetId, widgetParameterKey]) => [
            createWidgetIdParameterKey(widgetId, widgetParameterKey),
            [parameter] as const, // NOTE: Wrapping it inside new array to invalidate reference in a key block
          ]),
        ),
      )

      return {
        get(widgetId: string, parameterKey: string) {
          return map.get(createWidgetIdParameterKey(widgetId, parameterKey))
        },
      }
    })

    return { parameters, globalParameterOverrides }
  },
)

function parseParameters(apiParameters: App.ApiDashboard['parameters']) {
  return Object.keys(apiParameters).map((key) => {
    const { overrides, ...rest } = apiParameters[key]

    return {
      ...rest,
      key,
      type: 'Text',
      global: true,

      overrides: new Map(
        overrides.map(({ dashboard_query_mapping_id, parameter }) => [
          dashboard_query_mapping_id,
          parameter,
        ]),
      ),
    }
  })
}

export const SEPARATOR = '__swpk__'
export function createWidgetIdParameterKey(queryWidgetId: string, parameterKey: string) {
  return `${queryWidgetId}${SEPARATOR}${parameterKey}`
}
