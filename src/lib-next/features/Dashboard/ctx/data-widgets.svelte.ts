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
          return Object.assign(acc, { [localParameterKey]: getValue?.() })
        },
        Object.assign({}, localParameters),
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

export const useDashboardDataWidgetsFlow = createCtx(
  'dashboards_useDashboardDataWidgetsFlow',
  () => {
    const { dashboardDocument } = useDashboardCtx.get()

    let dataWidgets = $state.raw(
      dashboardDocument.dataWidgets
        .map((dataWidget) => {
          const schema = DataWidgetNodes[dataWidget.type]
          return schema && createDashboardDataWidget(dataWidget, schema)
        })
        .filter(Boolean) as TDashboardDataWidget<any>[],
    )

    const dataWidgetMap = $derived(new Map(dataWidgets.map((item) => [item.id, item])))

    return {
      dataWidgets,
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
  },
)

export type TDashboardDataWidget<GSchema extends TDataWidgetNode> = {
  id: TDataWidgetKey
  type: GSchema['name']
  state: {
    get $$(): ReturnType<NonNullable<GSchema['initState']>>
  }
}
function createDashboardDataWidget<GSchema extends TDataWidgetNode>(
  { id, type }: TApiDataWidget,
  schema: GSchema,
) {
  const defaultState = schema.initState()
  const state = $state<{ [key: string]: unknown }>(defaultState)

  return {
    id,
    type: type as GSchema['name'],
    state: {
      get $$() {
        return state
      },
    },
  }
}
