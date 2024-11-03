import type { ViewProps } from 'tiptap-svelte-adapter'
import { untrack } from 'svelte'
import { ss, type SS } from 'svelte-runes'
import { createCtx, getRandomKey } from 'san-webkit-next/utils'
import { useDashboardCtx } from './dashboard.svelte'
import type {
  TApiDashboardGlobalParameter,
  TDashboardGlobalParameterKey,
  TDataWidgetKey,
  TDataWidgetLocalParameterKey,
} from '../types'

export type TDashboardGlobalParameter<GType extends string = string, GValue = unknown> = {
  id: TDashboardGlobalParameterKey
  type: GType
  value: SS<GValue>
  overrides: SS<Map<TDataWidgetKey, TDataWidgetLocalParameterKey>>
}
function createDashboardGlobalParameter<GType extends string, GValue>({
  id,
  type,
  value,
  overrides,
}: TApiDashboardGlobalParameter<GType, GValue>): TDashboardGlobalParameter<GType, GValue> {
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

    let globalParameters = $state.raw(
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

      registerGlobalParameter<GType extends string, GValue>(
        globalParameterKey: undefined | TDashboardGlobalParameterKey,
        schema: { keyPrefix: string; name: GType; defaultValue: GValue },
      ): TDashboardGlobalParameter<GType, GValue> {
        const existing = globalParameterKey && globalParameterMap.get(globalParameterKey)
        if (existing) {
          return existing as TDashboardGlobalParameter<GType, GValue>
        }

        const globalParameter = createDashboardGlobalParameter({
          id: `${schema.keyPrefix}-${getRandomKey()}` as TDashboardGlobalParameterKey,
          type: schema.name,
          value: schema.defaultValue,
          overrides: [],
        })

        globalParameters = globalParameters.concat(globalParameter)

        return globalParameter
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

export function useGlobalParameterWidgetFlow<
  GSchema extends { name: string; keyPrefix: string; defaultValue: any },
>(view: ViewProps['view'], schema: GSchema) {
  type TValue = GSchema['defaultValue']
  const { registerGlobalParameter } = useDashboardGlobalParametersCtx.get()

  const viewAttrs = view.$.node.attrs
  const viewDataId = viewAttrs['data-id'] as undefined | TDashboardGlobalParameterKey
  const globalParameter = registerGlobalParameter<GSchema['name'], TValue>(viewDataId, schema)

  Object.assign(viewAttrs, { 'data-value': globalParameter.value.$, 'data-id': globalParameter.id })

  const viewDataValue = $derived(view.$.node.attrs['data-value'] as TValue)

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

      set $(value: TValue) {
        if (value === globalParameter.value.$) return

        view.$.updateAttributes({ 'data-value': value })
      },
    },
  }
}
