import type { TMetric } from 'san-webkit-next/ui/app/Chart/ctx/series.svelte'

import { Metric as M } from 'san-studio/lib/metrics'
import { millify } from 'san-webkit/lib/utils/formatting'
;(M as any)['mentions_percentage_total'] = {
  key: 'mentions_percentage_total',
  label: 'Mentions Percentage',
}

export function normalizeMetric(
  metric: {
    name: string
    key?: string
    pane?: number
    style?: any
    label?: string
    color?: string
    scaleId?: string
    selector?: any
    scaleFormatter?: any
    transformData?: any
  },
  colorGenerator: any,
): TMetric {
  const { name, key = name, pane = 0, style = 'line', color, scaleId, selector } = metric
  const {
    label = key,
    axisFormatter = yAxisFormatter,
    formatter = defaultTooltipFormatter,
  } = M[key] || { label: metric.label }

  return {
    name: key,
    label: metric.label ?? label,
    style,
    color: color || colorGenerator.new(),
    scaleId: scaleId ? scaleId : 'right-' + key + Math.random(),

    selector,
    pane,

    tooltipFormatter: formatter,
    scaleFormatter: metric.scaleFormatter || axisFormatter,
    transformData: metric.transformData,
  }
}

export function yAxisFormatter(value: number) {
  const absValue = Math.abs(value)

  if (absValue < 0.000001) {
    return +value.toFixed(10)
  }

  if (absValue < 0.001) {
    return +value.toFixed(6)
  }

  if (absValue < 10) {
    return +value.toFixed(4)
  }

  if (absValue > 999999) {
    return millify(value, 2)
  }

  if (absValue > 99999) {
    return millify(value, 2)
  }

  return millify(value, 2)
}

export function defaultTooltipFormatter(value: number) {
  if (value === undefined || value === null) {
    return 'Invalid data'
  }

  const absValue = Math.abs(value)
  if (absValue > 99999) {
    return millify(value, 3)
  }

  if (absValue < 0.000001) {
    return +value.toFixed(10)
  }

  return +value.toFixed(2)
}
