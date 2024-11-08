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
import type { TGlobalParameterNode } from '../DocumentContent/extensions/schema/global-parameter'

export type TDashboardGlobalParameter<GSchema extends TGlobalParameterNode> = {
  id: TDashboardGlobalParameterKey
  type: GSchema['name']

  state: {
    get $$(): ReturnType<NonNullable<GSchema['initState']>>
  }

  settings?: {
    get $$(): ReturnType<NonNullable<GSchema['initSettings']>>
  }

  overrides: SS<
    Record<
      keyof ReturnType<GSchema['initState']>,
      Map<TDataWidgetKey, TDataWidgetLocalParameterKey>
    >
  >
}
function createDashboardGlobalParameter<GSchema extends TGlobalParameterNode>(
  { id, type, value, overrides, settings }: TApiDashboardGlobalParameter,
  schema: GSchema,
): TDashboardGlobalParameter<GSchema> {
  const defaultState = schema.initState(value!) || value
  const defaultSettings = schema.initSettings(settings)

  const stateKeys = Object.keys(defaultState) as (keyof ReturnType<GSchema['initState']>)[]

  const _state = $state<{ [key: string]: unknown }>(defaultState)
  const _settings = $state<undefined | { [key: string]: unknown }>(defaultSettings)

  return {
    id,
    type: type as GSchema['name'],
    state: {
      get $$() {
        return _state as ReturnType<GSchema['initState']>
      },
    },
    settings: schema.initSettings && {
      get $$() {
        return _settings as ReturnType<NonNullable<GSchema['initSettings']>>
      },
    },

    overrides: ss(
      stateKeys.reduce(
        (acc, stateKey) => {
          const override = overrides[stateKey as string]

          if (override) {
            acc[stateKey] = new Map(override)
          }

          return acc
        },
        {} as Record<(typeof stateKeys)[number], Map<TDataWidgetKey, TDataWidgetLocalParameterKey>>,
      ),
    ),
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
          return schema && createDashboardGlobalParameter(apiParameter, schema)
        })
        .filter(Boolean) as TDashboardGlobalParameter<any>[],
    )

    const globalParameterMap = $derived(new Map(globalParameters.map((item) => [item.id, item])))

    const globalParameterByOverrideMap = $derived(
      new Map<string, () => unknown>(
        globalParameters.flatMap((globalParameter) => {
          const overrides = globalParameter.overrides.$
          return Object.entries(overrides).flatMap(([stateKey, overrides]) => {
            return Array.from(overrides).map((keys) => [
              keys.join('') as string,
              () => globalParameter.state.$$[stateKey],
            ])
          })
        }),
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
            overrides: { value: [] },
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

/**
 *
 * Hook used to setup custom document node's state
 *
 * @param view - Document's (tiptap) node view
 * @param schema - Global parameter schema
 * @returns
 */
export function useGlobalParameterWidgetFlow<GSchema extends TGlobalParameterNode>(
  view: ViewProps['view'],
  globalParameter: TDashboardGlobalParameter<GSchema>,
) {
  const { registerGlobalParameter } = useDashboardGlobalParametersCtx.get()

  const viewAttrs = view.$.node.attrs

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
