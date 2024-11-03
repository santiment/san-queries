import type { TDataWidgetKey, TDataWidgetLocalParameterKey } from '../types'
import { useDashboardGlobalParametersCtx } from './global-parameters.svelte'

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
        (acc, [localParameterKey, globalParameter]) => {
          return Object.assign(acc, { [localParameterKey]: globalParameter?.value.$ })
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
