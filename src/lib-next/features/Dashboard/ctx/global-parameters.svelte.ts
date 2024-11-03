import type { ViewProps } from 'tiptap-svelte-adapter'
import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { createCtx } from 'san-webkit-next/utils'
import { useDashboardCtx } from './dashboard.svelte'
import type {
  TDashboardGlobalParameter,
  TDashboardGlobalParameterKey,
  TDataWidgetKey,
  TDataWidgetLocalParameterKey,
} from '../types'

function createDashboardGlobalParameter({ id, type, value, overrides }: TDashboardGlobalParameter) {
  return {
    id,
    type,
    value: ss(value),
    overrides: ss(new Map(overrides)),
  }
}

export const useDashboardGlobalParametersCtx = createCtx(
  'queries_useDashboardGlobalParametersCtx',
  () => {
    const { dashboardDocument } = useDashboardCtx.get()

    const globalParameters = $state.raw(
      dashboardDocument.globalParameters.map(createDashboardGlobalParameter),
    )

    const globalParameterMap = $derived(new Map(globalParameters.map((item) => [item.id, item])))

    const globalParameterByOverrideMap = $derived(
      new Map(
        globalParameters.flatMap((item) =>
          Array.from(item.overrides.$).map((keys) => [keys.join('') as string, item]),
        ),
      ),
    )

    return {
      getGlobalParameter(globalParameterKey: TDashboardGlobalParameterKey) {
        return globalParameterMap.get(globalParameterKey)
      },

      registerGlobalParameter(globalParameterKey?: TDashboardGlobalParameterKey) {
        return globalParameterMap.get(globalParameterKey!)!
      },

      getGlobalParameterByOverride(
        dataWidgetId: TDataWidgetKey,
        localParameter: TDataWidgetLocalParameterKey,
      ) {
        return globalParameterByOverrideMap.get(dataWidgetId + localParameter)
      },
    }
  },
)

export function useGlobalParameterWidgetFlow(view: ViewProps['view']) {
  const { registerGlobalParameter } = useDashboardGlobalParametersCtx.get()

  const viewDataId = view.$.node.attrs['data-id'] as undefined | TDashboardGlobalParameterKey
  const globalParameter = registerGlobalParameter(viewDataId)

  Object.assign(view.$.node.attrs, { 'data-value': globalParameter.value.$ })

  const viewDataValue = $derived(view.$.node.attrs['data-value'] as string)

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    viewDataValue

    untrack(() => {
      if (viewDataValue === globalParameter.value.$) return

      globalParameter.value.$ = viewDataValue
    })
  })

  return {
    globalParameter,
    state: {
      get $() {
        return viewDataValue
      },

      set $(value: typeof viewDataValue) {
        if (value === globalParameter.value.$) return

        view.$.updateAttributes({ 'data-value': value })
      },
    },
  }
}
