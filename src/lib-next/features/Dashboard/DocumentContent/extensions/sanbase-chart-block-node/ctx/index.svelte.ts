import { untrack } from 'svelte'
import { Metric as M } from 'san-studio/lib/metrics'
import {
  useDataWidgetParameterOverrides,
  type TDashboardDataWidget,
} from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import {
  useChartGlobalParametersCtx,
  useColorGenerator,
  useMetricSeriesCtx,
} from 'san-webkit-next/ui/app/Chart/ctx'
import type { SANBASE_CHART_BLOCK_NODE } from '../schema'

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

  function normalizeMetric(metric: { name: string; key?: string }) {
    const { name, key = name } = metric
    const studioMetric = M[key]

    return {
      name: key,
      label: studioMetric?.label || key,
      style: 'line' as const,
      color: colorGenerator.new(),
      scaleId: 'right-' + key,
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
