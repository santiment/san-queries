<script lang="ts">
  import type { TSeries } from 'san-webkit-next/ui/app/Chart/ctx/series.svelte'
  import Button from 'san-webkit-next/ui/core/Button'

  type TProps = {
    slug?: string
    metrics: TSeries[]
  }

  const { slug, metrics }: TProps = $props()

  const href = $derived.by(() => {
    const filteredMetrics = metrics.map((metric) => metric.apiMetricName)

    const queryString = encodeURIComponent(
      JSON.stringify([
        {
          widget: 'ChartWidget',
          wm: [...filteredMetrics],
        },
      ]),
    )

    return `https://app.santiment.net/charts?slug=${slug}&widgets=${queryString}`
  })
</script>

<Button variant="fill" {href} data-source="dashboard_sanbase_chart_widget" data-type="see_on_charts"
  >See on Charts</Button
>
