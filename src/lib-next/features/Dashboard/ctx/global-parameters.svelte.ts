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
import { GlobalParameterNodes } from '../DocumentContent/extensions'
import type { TGlobalParameterNode } from '../DocumentContent/extensions/schema'

export type TDashboardGlobalParameter<GSchema extends TGlobalParameterNode> = {
  id: TDashboardGlobalParameterKey
  type: GSchema['name']

  state: {
    get $$(): ReturnType<NonNullable<GSchema['initState']>>
  }

  settings?: {
    get $$(): ReturnType<NonNullable<GSchema['initSettings']>>
  }

  overrides: SS<Map<TDataWidgetKey, TDataWidgetLocalParameterKey>>
}
function createDashboardGlobalParameter<GSchema extends TGlobalParameterNode>(
  { id, type, value, overrides }: TApiDashboardGlobalParameter,
  schema: GSchema,
) {
  const state = $state<{ [key: string]: unknown }>(schema.initState(value!) || value)
  const settings = $state<undefined | { [key: string]: unknown }>(schema.initSettings?.({}))

  return {
    id,
    type: type as GSchema['name'],
    state: {
      get $$() {
        return state as ReturnType<GSchema['initState']>
      },
    },
    settings: schema.initSettings && {
      get $$() {
        return settings as ReturnType<NonNullable<GSchema['initSettings']>>
      },
    },

    overrides: ss(new Map(overrides)),
  }
}

export const useDashboardGlobalParametersCtx = createCtx(
  'queries_useDashboardGlobalParametersCtx',
  () => {
    const { dashboardDocument } = useDashboardCtx.get()

    let globalParameters = $state.raw(
      dashboardDocument.globalParameters
        .map((apiParameter) => {
          const schema = GlobalParameterNodes[apiParameter.type]
          console.log(apiParameter)
          return schema && createDashboardGlobalParameter(apiParameter, schema)
        })
        .filter(Boolean),
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

      registerGlobalParameter<GSchema extends TGlobalParameterNode>(
        globalParameterKey: undefined | TDashboardGlobalParameterKey,
        schema: GSchema,
      ) {
        const existing = globalParameterKey && globalParameterMap.get(globalParameterKey)
        if (existing) {
          return existing as TDashboardGlobalParameter<GSchema>
        }

        const globalParameter = createDashboardGlobalParameter(
          {
            id: `${schema.keyPrefix}-${getRandomKey()}` as TDashboardGlobalParameterKey,
            type: schema.name,
            value: {},
            overrides: [],
          },
          schema,
        )

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

export function useGlobalParameterWidgetFlow<GSchema extends TGlobalParameterNode>(
  view: ViewProps['view'],
  schema: GSchema,
) {
  const { registerGlobalParameter } = useDashboardGlobalParametersCtx.get()

  const viewAttrs = view.$.node.attrs
  const viewDataId = viewAttrs['data-id'] as undefined | TDashboardGlobalParameterKey
  const globalParameter = registerGlobalParameter(viewDataId, schema)

  Object.assign(viewAttrs, {
    ...globalParameter.state.$$,
    'data-id': globalParameter.id,
  })

  const stateKeys = Object.keys(globalParameter.state.$$)
  const viewStateAttrs = $derived(view.$.node.attrs)

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    viewStateAttrs

    untrack(() => {
      for (const stateKey of stateKeys) {
        const attrValue = viewStateAttrs[stateKey]
        if (attrValue === globalParameter.state.$$[stateKey]) continue

        globalParameter.state.$$[stateKey as TStateKeys] = attrValue
      }
    })
  })

  type TState = ReturnType<GSchema['initState']>
  type TStateKeys = keyof TState
  return {
    globalParameter,
    update<GStateKey extends TStateKeys>(stateKey: GStateKey, value: TState[GStateKey]) {
      if (value === globalParameter.state.$$[stateKey]) {
        return
      }

      view.$.updateAttributes({ [stateKey]: value })
    },
  }
}
