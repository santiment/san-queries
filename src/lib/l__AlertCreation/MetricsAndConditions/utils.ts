import type { OperationValuesType } from './conditions'

import { checkIsUsdMetric } from './metrics'

export function getOperationSign(
  metric: App.Alerts.Metric,
  operation: OperationValuesType,
): '' | '%' | '$' {
  if (operation.label.includes('%')) return '%'

  if (checkIsUsdMetric(metric)) return '$'

  return ''
}

export function describe(metric: null | App.Alerts.Metric, conditions: App.Alerts.Conditions) {
  const { time, operation } = conditions
  const sign = metric ? getOperationSign(metric, operation.type) : ''

  let description = operation.type.label.includes('%') ? 'moving ' : 'goes '

  description += operation.type.describe(
    operation.values.map((v) => (v || 1) + sign) as [string, string],
  )

  return description + ` compared to ${time.value || 1} ${time.type.label.toLowerCase()} earlier`
}
