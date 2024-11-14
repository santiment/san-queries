import type { ViewProps } from 'tiptap-svelte-adapter'
import type {
  TApiDashboardGlobalParameter,
  TDashboardGlobalParameterKey,
  TDataWidgetKey,
  TDataWidgetLocalParameterKey,
} from '../types'
import type { TGlobalParameterNode } from '../DocumentContent/extensions/schema/global-parameter'

import { untrack } from 'svelte'
import { ss, type SS } from 'svelte-runes'
import { createCtx, getRandomKey } from 'san-webkit-next/utils'
import { useDashboardCtx } from './dashboard.svelte'
import {
  GlobalParameterNodes,
  type TParameterWidgetNodeSchemas,
} from '../DocumentContent/extensions'

type TMap<T extends TGlobalParameterNode> = T extends any ? TDashboardGlobalParameter<T> : never
export type TDashboardParameterWidgets = TMap<TParameterWidgetNodeSchemas>

export type TDashboardGlobalParameter<GSchema extends TGlobalParameterNode> = {
  id: TDashboardGlobalParameterKey
  type: GSchema['name']

  outputs: {
    get $$(): ReturnType<NonNullable<GSchema['initOutputs']>>
  }

  settings: GSchema['initSettings'] extends () => infer TSettings
    ? {
        get $$(): TSettings
      }
    : undefined

  overrides: SS<
    Record<
      keyof ReturnType<GSchema['initOutputs']>,
      Map<TDataWidgetKey, TDataWidgetLocalParameterKey>
    >
  >

  __isDestroyed: SS<boolean>
}
function createDashboardGlobalParameter<GSchema extends TGlobalParameterNode>(
  { id, type, value, overrides, settings }: TApiDashboardGlobalParameter,
  schema: GSchema,
): TDashboardGlobalParameter<GSchema> {
  const defaultOutputValues = schema.initOutputs(value!) || value
  const defaultSettings = schema.initSettings?.(settings)

  const outputKeys = Object.keys(defaultOutputValues) as (keyof ReturnType<
    GSchema['initOutputs']
  >)[]

  const _state = $state<{ [key: string]: unknown }>(defaultOutputValues)
  const _settings = $state<undefined | { [key: string]: unknown }>(defaultSettings)

  return {
    id,
    type: type as GSchema['name'],

    outputs: {
      get $$() {
        return _state as ReturnType<GSchema['initOutputs']>
      },
    },
    settings: schema.initSettings && {
      get $$() {
        return _settings as ReturnType<NonNullable<GSchema['initSettings']>>
      },
    },

    overrides: ss(
      outputKeys.reduce(
        (acc, stateKey) => {
          const override = overrides[stateKey as string]

          if (override) {
            acc[stateKey] = new Map(override)
          }

          return acc
        },
        {} as Record<
          (typeof outputKeys)[number],
          Map<TDataWidgetKey, TDataWidgetLocalParameterKey>
        >,
      ),
    ),

    __isDestroyed: ss(false),
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
          return (
            schema &&
            (createDashboardGlobalParameter(apiParameter, schema) as TDashboardParameterWidgets)
          )
        })
        .filter((item) => !!item),
    )

    const globalParameterMap = $derived(new Map(globalParameters.map((item) => [item.id, item])))

    const globalParameterByOverrideMap = $derived(
      new Map<string, () => unknown>(
        globalParameters.flatMap((globalParameter: TDashboardGlobalParameter<any>) => {
          const overrides = globalParameter.overrides.$
          if (globalParameter.__isDestroyed.$) {
            return []
          }

          return Object.entries(overrides).flatMap(([outputKey, overrides]) => {
            return Array.from(overrides).map((keys) => [
              keys.join('') as string,
              () => globalParameter.outputs.$$[outputKey],
            ])
          })
        }),
      ),
    )

    return {
      parameterWidgets: {
        get $() {
          return globalParameters
        },
      },
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
  // const { registerGlobalParameter } = useDashboardGlobalParametersCtx.get()

  const viewAttrs = view.$.node.attrs

  Object.assign(viewAttrs, {
    ...globalParameter.outputs.$$,
    'data-id': globalParameter.id,
  })

  const outputKeys = Object.keys(globalParameter.outputs.$$)
  const viewStateAttrs = $derived(view.$.node.attrs)

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    viewStateAttrs

    untrack(() => {
      for (const outputKey of outputKeys) {
        const attrValue = viewStateAttrs[outputKey]
        if (attrValue === globalParameter.outputs.$$[outputKey]) continue

        globalParameter.outputs.$$[outputKey as TOutputKeys] = attrValue
      }
    })
  })

  type TOutputs = ReturnType<GSchema['initOutputs']>
  type TOutputKeys = keyof TOutputs
  return {
    globalParameter,
    update<GOutputKey extends TOutputKeys>(outputKey: GOutputKey, value: TOutputs[GOutputKey]) {
      if (value === globalParameter.outputs.$$[outputKey]) {
        return
      }

      view.$.editor.commands.focus(view.$.getPos())
      view.$.updateAttributes({ [outputKey]: value })
    },
  }
}

export function serializeParameterWidget(
  item: TDashboardParameterWidgets,
  usedIds?: Set<string>,
): TApiDashboardGlobalParameter {
  const { id, type, outputs, overrides, settings } = item

  return {
    id,
    type,
    outputs: $state.snapshot(outputs.$$),
    overrides: Object.entries<Map<TDataWidgetKey, TDataWidgetLocalParameterKey>>(
      $state.snapshot(overrides.$),
    ).reduce((acc, [key, overrides]) => {
      const _overrides = Array.from(overrides)

      acc[key] = usedIds ? _overrides.filter(([id]) => usedIds.has(id)) : _overrides

      return acc
    }, {} as any),
    settings: $state.snapshot(settings.$$),
  }
}
