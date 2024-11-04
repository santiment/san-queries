import { createCtx } from 'san-webkit-next/utils'
import type { TDataWidgetKey, TDataWidgetLocalParameterKey } from '../types'
import { useDashboardGlobalParametersCtx } from './global-parameters.svelte'
import { useDashboardCtx } from './dashboard.svelte'

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

    let dataWidgets = $state.raw(dashboardDocument.dataWidgets.map(createDashboardDataWidget))
  },
)

export type TDashboardDataWidget<
  GType extends string = string,
  GState = { [key: string]: unknown },
> = {
  id: TDataWidgetKey
  type: GType
  state: {
    get $$(): GState
  }
}
function createDashboardDataWidget({ id, type, state }: TDashboardDataWidget) {
  const _state = $state(Object.assign({}, state))
  return {
    id,
    type,
    state: {
      get $$() {
        return _state
      },
    },
  }
}
