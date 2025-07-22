<script module lang="ts">
  import Component from './DetailedDialog.svelte'

  export const showDetailedDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'
  import { tick } from 'svelte'

  import MetricsChart from './MetricsChart.svelte'

  type TProps = TDialogProps & { metrics: any; priceAsset: any }
  let { metrics }: TProps = $props()

  const mainMetrics = [metrics.slice(0, 5)].concat(
    metrics.slice(5).map((item: any) => {
      return [
        { name: 'price_usd', label: 'Price USD', color: '#26C953' },
        { ...item, pane: 0 },
      ]
    }),
  )

  const promise = new Promise((resolve) => setTimeout(resolve, 500))
</script>

<Dialog class="h-full w-full overflow-auto column">
  <div class="gap-4 p-6 column">
    {#await tick().then(tick) then _}
      <MetricsChart metrics={mainMetrics[0]}></MetricsChart>
    {/await}

    {#await promise then _}
      {#each mainMetrics.slice(1) as metrics}
        <MetricsChart {metrics}></MetricsChart>
      {/each}
    {/await}
  </div>
</Dialog>
