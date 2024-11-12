import {
  useDataWidgetParameterOverrides,
  type TDashboardDataWidget,
} from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import { useChartGlobalParametersCtx, useMetricSeriesCtx } from 'san-webkit-next/ui/app/Chart/ctx'
import type { SANBASE_CHART_BLOCK_NODE } from '../schema'

export function useSanbaseChartWidgetFlow(
  widget: TDashboardDataWidget<typeof SANBASE_CHART_BLOCK_NODE>,
) {
  const { id, settings } = widget
  const defaults = widget.data.inputs

  const { parameterOverrides } = useDataWidgetParameterOverrides(id, widget.data.inputs)
  const { metricSeries } = useMetricSeriesCtx(settings.$$.metrics)

  const slug = $derived(parameterOverrides.$.slug || defaults.slug)
  const from = $derived(normalizeDate(parameterOverrides.$.from) || defaults.from)
  const to = $derived(normalizeDate(parameterOverrides.$.to) || defaults.to)

  const { globalParameters: chartGlobalParameters } = useChartGlobalParametersCtx.set({
    selector: { slug },
    from,
    to,
  })

  $effect(() => {
    chartGlobalParameters.$$.selector.slug = slug
    chartGlobalParameters.$$.from = from
    chartGlobalParameters.$$.to = to
  })

  return {}
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
