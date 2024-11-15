import type { ViewProps } from 'tiptap-svelte-adapter'
import type {
  TApiDashboardGlobalParameter,
  TDashboardGlobalParameterKey,
  TDataWidgetKey,
  TDataWidgetLocalParameterKey,
} from '../types'
import type { TParameterWidgetNode } from '../DocumentContent/extensions/schema/parameter-widget'

import { untrack } from 'svelte'
import { ss, type SS } from 'svelte-runes'
import { createCtx, getRandomKey } from 'san-webkit-next/utils'
import { useDashboardCtx } from './dashboard.svelte'
import {
  GlobalParameterNodes,
  type TParameterWidgetNodeSchemas,
} from '../DocumentContent/extensions'

type TMap<T extends TParameterWidgetNode> = T extends any ? TDashboardParameterWidget<T> : never
export type TDashboardParameterWidgets = TMap<TParameterWidgetNodeSchemas>

export type TDashboardParameterWidget<GSchema extends TParameterWidgetNode> = {
  id: TDashboardGlobalParameterKey
  type: GSchema['name']

  outputs: {
    get $$(): ReturnType<NonNullable<GSchema['initOutputs']>>
  }

  /** Deep changes will trigger API save action */
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
function createDashboardParameterWidget<GSchema extends TParameterWidgetNode>(
  { id, type, outputs, overrides, settings }: TApiDashboardGlobalParameter,
  schema: GSchema,
): TDashboardParameterWidget<GSchema> {
  const defaultOutputValues = schema.initOutputs(outputs!) || outputs
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

export const useDashboardParameterWidgetsCtx = createCtx(
  'queries_useDashboarParameterWidgetsCtx',
  () => {
    const { dashboardDocument } = useDashboardCtx.get()

    let parameterWidgets = $state.raw(
      dashboardDocument.parameterWidgets
        .map((apiParameter) => {
          const schema = GlobalParameterNodes[apiParameter.type]
          return (
            schema &&
            (createDashboardParameterWidget(apiParameter, schema) as TDashboardParameterWidgets)
          )
        })
        .filter((item) => !!item),
    )

    const parameterWidgetMap = $derived(new Map(parameterWidgets.map((item) => [item.id, item])))

    const parameterWidgetByOverrideMap = $derived(
      new Map<string, () => unknown>(
        parameterWidgets.flatMap((globalParameter: TDashboardParameterWidget<any>) => {
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
          return parameterWidgets
        },
      },
      getParameterWidget(globalParameterKey: TDashboardGlobalParameterKey) {
        return parameterWidgetMap.get(globalParameterKey)
      },

      registerParameterWidget<GSchema extends TParameterWidgetNode>(
        globalParameterKey: undefined | TDashboardGlobalParameterKey,
        schema: GSchema,
      ) {
        const existing = globalParameterKey && parameterWidgetMap.get(globalParameterKey)
        if (existing) {
          return existing as TDashboardParameterWidget<GSchema>
        }

        const globalParameter = createDashboardParameterWidget(
          {
            id: `${schema.keyPrefix}-${getRandomKey()}` as TDashboardGlobalParameterKey,
            type: schema.name,
            outputs: {},
            overrides: { value: [] },
          },
          schema,
        )

        parameterWidgets = parameterWidgets.concat(globalParameter)

        return globalParameter
      },

      getParameterWidgetByOverride(
        dataWidgetId: TDataWidgetKey,
        localParameter: TDataWidgetLocalParameterKey,
      ) {
        return parameterWidgetByOverrideMap.get(dataWidgetId + localParameter)
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
export function useParameterWidgetFlow<GSchema extends TParameterWidgetNode>(
  view: ViewProps['view'],
  globalParameter: TDashboardParameterWidget<GSchema>,
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
    settings: settings && $state.snapshot(settings.$$),
  }
}
