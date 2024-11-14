import type { TApiDataWidget, TDataWidgetKey, TDataWidgetLocalParameterKey } from '../types'
import type { TDataWidgetNode } from '../DocumentContent/extensions/schema/data-widget'
import { getAllContexts } from 'svelte'
import { ss, type SS } from 'svelte-runes'
import { createCtx } from 'san-webkit-next/utils'
import { useDashboardParameterWidgetsCtx } from './parameter-widgets.svelte'
import { useDashboardCtx } from './dashboard.svelte'
import { DataWidgetNodes, type TDataWidgetNodeSchemas } from '../DocumentContent/extensions'

type TMap<T extends TDataWidgetNode> = T extends any ? TDashboardDataWidget<T> : never
type TDashboardDataWidgets = TMap<TDataWidgetNodeSchemas>

export function useDataWidgetParameterOverrides<
  GParams extends {
    [localParameterKey: TDataWidgetLocalParameterKey]: any
  },
>(id: TDataWidgetKey, localParameters: GParams) {
  const { getParameterWidgetByOverride } = useDashboardParameterWidgetsCtx.get()

  const globalParameterOverrides = $derived(
    Object.keys(localParameters)
      .map(
        (localParameter) =>
          [
            localParameter,
            getParameterWidgetByOverride(id, localParameter as TDataWidgetLocalParameterKey),
          ] as const,
      )
      .reduce(
        (acc, [localParameterKey, getValue]) => {
          if (getValue) acc[localParameterKey] = getValue()
          return acc
        },
        {} as Record<string, any>,
      ),
  )

  return {
    parameterOverrides: {
      get $() {
        return globalParameterOverrides
      },
    },
  }
}

export type TDashboardDataWidgetByType = {
  [K in keyof typeof DataWidgetNodes]: TDashboardDataWidget<(typeof DataWidgetNodes)[K]>
}

export const useDashboardDataWidgets = createCtx('dashboards_useDashboardDataWidgets', () => {
  const ALL_CTXS = getAllContexts()
  const { dashboardDocument } = useDashboardCtx.get()

  let dataWidgets = $state.raw(
    dashboardDocument.dataWidgets
      .map((dataWidget) => {
        const schema = DataWidgetNodes[dataWidget.type as keyof typeof DataWidgetNodes]
        return (
          schema &&
          (createDashboardDataWidget(dataWidget, schema, ALL_CTXS) as TDashboardDataWidgets)
        )
      })
      .filter((item) => !!item),
  )

  const dataWidgetMap = $derived(new Map(dataWidgets.map((item) => [item.id, item])))

  return {
    dataWidgets: {
      get $() {
        return dataWidgets
      },
    },
    getDataWidget(dataWidgetKey: TDataWidgetKey) {
      return dataWidgetMap.get(dataWidgetKey)
    },

    createDashboardDataWidget<GSchema extends TDataWidgetNode>(
      apiDataWidget: TApiDataWidget,
      schema: GSchema,
    ) {
      const dataWidget = createDashboardDataWidget(apiDataWidget, schema, ALL_CTXS)

      dataWidgets = dataWidgets.concat(dataWidget)

      return dataWidget
    },
  }
})

export type TDashboardDataWidget<GSchema extends TDataWidgetNode> = {
  id: TDataWidgetKey
  type: GSchema['name']
  state: {
    get $$(): ReturnType<GSchema['initState']>
  }
  settings: GSchema['initSettings'] extends () => infer TSettings
    ? {
        get $$(): TSettings
      }
    : undefined

  data: GSchema['initData'] extends (...args: any[]) => infer TData ? TData : undefined

  __isDestroyed: SS<boolean>
}
function createDashboardDataWidget<GSchema extends TDataWidgetNode>(
  { id, type, settings }: TApiDataWidget,
  schema: GSchema,
  allCtxs: Map<string, any>,
): TDashboardDataWidget<GSchema> {
  const defaultState = schema.initState()
  const defaultSettings = schema.initSettings?.(settings)

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

    data:
      schema.initData &&
      (schema.initData(id, allCtxs) as ReturnType<NonNullable<GSchema['initData']>>),

    __isDestroyed: ss(false),
  }
}

export function serializeDataWidget(item: TDashboardDataWidgets): TApiDataWidget {
  const { id, type, settings } = item

  return {
    id,
    type,

    settings: settings ? $state.snapshot(settings.$$) : undefined,
  }
}
