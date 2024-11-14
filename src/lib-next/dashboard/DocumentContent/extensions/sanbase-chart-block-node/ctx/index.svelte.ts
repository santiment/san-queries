import type { SANBASE_CHART_BLOCK_NODE } from '../schema'
import type { TMetric } from 'san-webkit-next/ui/app/Chart/ctx/series.svelte'
import { millify } from 'san-webkit/lib/utils/formatting'
import { Metric as M } from 'san-studio/lib/metrics'
import {
  useDataWidgetParameterOverrides,
  type TDashboardDataWidget,
} from '$lib-next/dashboard/ctx/data-widgets.svelte'
import {
  useChartGlobalParametersCtx,
  useColorGenerator,
  useMetricSeriesCtx,
} from 'san-webkit-next/ui/app/Chart/ctx'

export function useSanbaseChartWidgetFlow(
  widget: TDashboardDataWidget<typeof SANBASE_CHART_BLOCK_NODE>,
) {
  const { id, settings } = widget
  const defaults = widget.data.inputs

  const { colorGenerator } = useColorGenerator()
  const defaultMetrics = settings.$$.metrics.map((item) => normalizeMetric(item))

  const { parameterOverrides } = useDataWidgetParameterOverrides(id, widget.data.inputs)
  const { metricSeries } = useMetricSeriesCtx(defaultMetrics)

  const slug = $derived(parameterOverrides.$.slug || defaults.slug)
  const from = $derived(normalizeDate(parameterOverrides.$.from) || defaults.from)
  const to = $derived(normalizeDate(parameterOverrides.$.to) || defaults.to)

  const { globalParameters: chartParameters } = useChartGlobalParametersCtx.set({
    selector: { slug },
    from,
    to,
  })

  $effect(() => {
    chartParameters.$$.selector.slug = slug
    chartParameters.$$.from = from
    chartParameters.$$.to = to
  })

  $effect(() => {
    settings.$$.metrics = metricSeries.$.map((item) => ({
      name: item.apiMetricName,
      style: item.type.$ as 'line',
    }))
  })

  function normalizeMetric(metric: { name: string; key?: string }): TMetric {
    const { name, key = name } = metric
    const {
      label = key,
      axisFormatter = yAxisFormatter,
      formatter = defaultTooltipFormatter,
    } = M[key] || {}

    return {
      name: key,
      label,
      style: 'line' as const,
      color: colorGenerator.new(),
      scaleId: 'right-' + key,

      tooltipFormatter: formatter,
      scaleFormatter: axisFormatter,
    }
  }

  return {
    metricSeries,
    chartParameters,
    normalizeMetric,
  }
}

function normalizeDate(dateInput = '') {
  if (typeof dateInput !== 'string') {
    return dateInput
  }

  if (dateInput.startsWith('utc_')) {
    return dateInput
  }

  try {
    const date = new Date(dateInput)
    return date.toISOString()
  } catch {
    return dateInput
  }
}

export function yAxisFormatter(value: number) {
  const absValue = Math.abs(value)

  if (absValue < 0.000001) {
    return +value.toFixed(10)
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
