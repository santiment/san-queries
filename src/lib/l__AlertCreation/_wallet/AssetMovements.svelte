<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { formatUsd } from 'san-webkit/lib/utils/formatting'
  import AddAsset from '../AddAsset.svelte'
  import { queryWalletAssets } from '../api'
  import Info from './Info.svelte'
  import Conditions from '../MetricsAndConditions/Conditions.svelte'
  import { Operation, TimeRange } from '../MetricsAndConditions/conditions'
  import { describe } from '../MetricsAndConditions/utils'

  export let asset: any
  export let step: App.Alerts.Step<any, any>
  export let onSelect: (asset: any) => any

  let assets = [] as any[]
  if (!step.value.conditions) {
    step.value.conditions = {
      operation: { type: Operation.above, values: [1, 1] },
      time: { type: TimeRange.d, value: 1 },
    }
  }

  $: ({ address, infrastructure } = step.value.target)
  $: if (infrastructure) queryWalletAssets(address, infrastructure).then((data) => (assets = data))
</script>

<Conditions metric={null} bind:conditions={step.value.conditions}>
  <svelte:fragment slot="info">
    {#if !step.value.target.use_combined_balance}
      <div class="relative">
        <AddAsset {assets} {onSelect}>
          <button class="btn-2 btn--s fluid row justify v-center mb-3 !px-2 !py-1.5">
            {#if asset}
              {asset.name}
            {:else}
              Select an asset
            {/if}

            <Svg id="arrow-down" w="8" />
          </button>
        </AddAsset>
      </div>
    {/if}

    {#if asset && +asset.priceUsd.toFixed(0) !== 1}
      <Info>
        {asset.name}
        {describe(null, step.value.conditions)}

        <svelte:fragment slot="description">
          1 {asset.ticker} = {formatUsd(asset.priceUsd * 100)}
        </svelte:fragment>
      </Info>
    {/if}
  </svelte:fragment>
</Conditions>
