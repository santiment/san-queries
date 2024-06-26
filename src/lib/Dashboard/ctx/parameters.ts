import { Map as Map$ } from 'svelte/reactivity'
import { ss, ssd } from 'svelte-runes'
import { createCtx } from '$lib/ctx'

export const useDashboardParametersCtx = createCtx(
  'useDashboardParametersCtx',
  (apiParameters?: App.ApiDashboard['parameters']) => {
    const parameters = ss(apiParameters ? parseParameters(apiParameters) : [])

    const globalParameterOverrides = ssd(() => {
      const widgetParams = {} as Record<string, undefined | Record<string, undefined | string>>

      const addWidgetParameter = (widgetId: string, widgetParameterKey: string, value: any) => {
        let widget = widgetParams[widgetId]
        if (!widget) widget = widgetParams[widgetId] = {}

        widget[widgetParameterKey] = value

        return createWidgetIdParameterKey(widgetId, widgetParameterKey)
      }

      const map = new Map$(
        parameters.$.flatMap((parameter) =>
          [...parameter.overrides.entries()].map(([widgetId, widgetParameterKey]) => [
            addWidgetParameter(widgetId, widgetParameterKey, parameter.value),
            [parameter] as const, // NOTE: Wrapping it inside new array to invalidate reference in a key block
          ]),
        ),
      )

      return {
        widgetParams,
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

      overrides: new Map$(
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

export const useGlobalParametersCtx = createCtx('useGlobalParametersCtx', () => {
  const { parameters } = useDashboardParametersCtx()

  const globalParameterByKey = ssd(() => new Map(parameters.$.map((param) => [param.key, param])))

  const globalParameterByOverrides = ssd(
    () =>
      new Map(
        parameters.$.flatMap((parameter) =>
          [...parameter.overrides].map((override) => [override.toString(), parameter]),
        ),
      ),
  )

  return {
    globalParameters: parameters,
    globalParameterByKey,
    globalParameterByOverrides,
    removeGlobalParameter(parameter: (typeof parameters)['$'][number]) {
      parameters.$ = parameters.$.filter((item) => item !== parameter)
    },
  }
})
