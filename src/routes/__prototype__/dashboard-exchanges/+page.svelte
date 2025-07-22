<script lang="ts">
  import TabButtons from '$lib/ui/TabButtons/index.js'
  import DetailedChart from './DetailedChart/index.js'
  import WaveChart from './WaveChart/index.js'
  import { useViewportPriorityCtx } from 'san-webkit-next/ctx/viewport-priority'
  import { JobScheduler } from 'san-webkit-next/utils'
  import {
    useApiMetricFetchSettingsCtx,
    useChartGlobalParametersCtx,
  } from 'san-webkit-next/ui/app/Chart/ctx'
  import { useAssetsCtx, type TAssetSlug } from 'san-webkit-next/ctx/assets'
  import { useClockCtx } from 'san-webkit-next/ctx/time'

  const tabs = [
    {
      title: 'Layerzero',
      tab: 'layerzero',
    },
    {
      title: 'Gearbox',
      tab: 'gearbox',
    },
  ]

  const jobScheduler = JobScheduler({ concurrentLimit: 10 })
  useApiMetricFetchSettingsCtx.set({ jobScheduler })
  useViewportPriorityCtx.set()

  useClockCtx()

  const { globalParameters } = useChartGlobalParametersCtx.set({
    selector: { slug: 'bitcoin' as TAssetSlug },
    from: 'utc_now-90d',
    to: 'utc_now',
    interval: '1d',
  })
  const { getAssetBySlug } = useAssetsCtx.get()

  const priceAsset = $derived(
    getAssetBySlug(globalParameters.$$.selector.slug!) || { ticker: 'BTC' },
  )

  let active = $state.raw(tabs[0])
</script>

<main class="mx-auto mt-8 w-full max-w-[1027px] pb-8">
  <h1 class="mb-10 text-3xl font-medium">Dashboard of Exchanges</h1>
  <TabButtons bind:active {tabs} class="mb-10" />

  <DetailedChart {priceAsset} onlyProjectChannels={active.tab} />

  <WaveChart class="mt-10" />
</main>
