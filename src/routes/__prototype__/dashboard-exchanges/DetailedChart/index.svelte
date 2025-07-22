<script lang="ts">
  import { untrack } from 'svelte'
  import {
    useChartCtx,
    useColorGenerator,
    useMetricSeriesCtx,
  } from 'san-webkit-next/ui/app/Chart/ctx'
  import { PaneMetric } from 'san-webkit-next/ui/app/Chart/PaneLegend'

  import { showDetailedDialog$ } from './DetailedDialog.svelte'
  import { normalizeMetric } from './utils.js'

  import Chart from './Chart.svelte'

  type TProps = { priceAsset: { ticker: string }; onlyProjectChannels: string }

  let { priceAsset, onlyProjectChannels }: TProps = $props()

  const { chart } = useChartCtx()
  const { colorGenerator } = useColorGenerator()

  const showDetailedDialog = showDetailedDialog$()

  const selector = {
    get $() {
      return { text: '*', onlyProjectChannels }
    },
  }

  const METRICS = [
    {
      name: 'social_volume_twitter',
      label: 'Social Volume Twitter',
      style: 'histogram',
      color: '#68DBF4',
      selector,
    },
    {
      name: 'social_volume_telegram',
      label: 'Social Volume Telegram',
      style: 'histogram',
      color: '#ebb736',
      selector,
    },
    {
      name: 'price_usd',
      label: 'USD',
      color: '#26C953',
    },
    {
      name: 'social_dominance_twitter',
      label: 'Social Dominance Twitter',
      pane: 1,
      selector,
    },
    {
      name: 'social_dominance_telegram',
      label: 'Social Dominance Telegram',
      pane: 1,
      selector,
    },
    // METRICS BELOW DOESN'T WORK YET. SKIP FOR NOW
    {
      name: 'social_active_users',
      label: 'Social Active Users Twitter',
      pane: 2,
      selector: {
        get $() {
          return { source: 'twitter', onlyProjectChannels }
        },
      },
    },
    {
      name: 'social_active_users',
      label: 'Social Active Users Telegram',
      pane: 2,
      selector: {
        get $() {
          return { source: 'telegram', onlyProjectChannels }
        },
      },
    },
  ]

  const { metricSeries } = useMetricSeriesCtx.set(
    METRICS.map((item) => normalizeMetric(item, colorGenerator)),
  )

  $effect(() => {
    if (!chart.$) return

    metricSeries.$

    untrack(() => {
      const pane = chart.$!.panes()[0]
      setTimeout(() => {
        pane.setHeight(230)
      }, 300)
    })
  })
</script>

<Chart onFullscreenClick={() => showDetailedDialog({ priceAsset, metrics: METRICS })}>
  {#snippet paneLegend({ metrics, index })}
    {#each metrics as metric (metric.id)}
      {#if index === 0}
        <PaneMetric {metric}>
          {#snippet label()}
            {#if metric.apiMetricName === 'price_usd'}
              {priceAsset.ticker} / USD
            {:else}
              {metric.label}
            {/if}
          {/snippet}
        </PaneMetric>
      {:else}
        <div class="px-1.5">{metric.label}</div>
      {/if}
    {/each}
  {/snippet}
</Chart>
