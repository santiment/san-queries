import type { TApiDataWidget, TDataWidgetKey, TDataWidgetLocalParameterKey } from '../types'
import type { TDataWidgetNode } from '../DocumentContent/extensions/schema/data-widget'
import { createCtx } from 'san-webkit-next/utils'
import { useDashboardGlobalParametersCtx } from './global-parameters.svelte'
import { useDashboardCtx } from './dashboard.svelte'
import { DataWidgetNodes } from '../DocumentContent/extensions'

export function useDataWidgetParameterOverrides<
  GParams extends {
    [localParameterKey: TDataWidgetLocalParameterKey]: any
  },
>(id: TDataWidgetKey, localParameters: GParams) {
  const { getGlobalParameterByOverride } = useDashboardGlobalParametersCtx.get()

  const globalParameterOverrides = $derived(
    Object.keys(localParameters)
      .map(
        (localParameter) =>
          [
            localParameter,
            getGlobalParameterByOverride(id, localParameter as TDataWidgetLocalParameterKey),
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
  const { dashboardDocument } = useDashboardCtx.get()

  let dataWidgets = $state.raw(
    dashboardDocument.dataWidgets
      .map((dataWidget) => {
        const schema = DataWidgetNodes[dataWidget.type as keyof typeof DataWidgetNodes]
        return schema && createDashboardDataWidget(dataWidget, schema)
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
      const dataWidget = createDashboardDataWidget(apiDataWidget, schema)

      dataWidgets = dataWidgets.concat(dataWidget)

      return dataWidgets
    },
  }
})

export type TDashboardDataWidget<GSchema extends TDataWidgetNode> = {
  id: TDataWidgetKey
  type: GSchema['name']
  state: {
    get $$(): ReturnType<GSchema['initState']>
  }
}
function createDashboardDataWidget<GSchema extends TDataWidgetNode>(
  { id, type }: TApiDataWidget,
  schema: GSchema,
): TDashboardDataWidget<GSchema> {
  const defaultState = schema.initState()
  const _state = $state<{ [key: string]: unknown }>(defaultState)

  return {
    id,
    type: type as GSchema['name'],
    state: {
      get $$() {
        return _state as ReturnType<GSchema['initState']>
      },
    },
  }
}
