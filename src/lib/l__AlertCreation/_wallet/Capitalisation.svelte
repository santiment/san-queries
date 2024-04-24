<script lang="ts">
  import { formatUsd } from 'san-webkit/lib/utils/formatting'
  import { queryWalletAssets } from '../api'
  import Info from './Info.svelte'
  import Conditions from '../MetricsAndConditions/Conditions.svelte'
  import { Operation, TimeRange } from '../MetricsAndConditions/conditions'
  import { describe } from '../MetricsAndConditions/utils'

  export let step: App.Alerts.Step<any, any>

  if (!step.value.conditions) {
    step.value.conditions = {
      operation: { type: Operation.above, values: [1, 1] },
      time: { type: TimeRange.d, value: 1 },
    }
  }

  let balance = 0

  $: ({ address, infrastructure } = step.value.target)
  $: if (infrastructure)
    queryWalletAssets(address, infrastructure).then(
      (data) => (balance = data.reduce((acc, { balanceUsd }) => acc + balanceUsd, 0)),
    )
</script>

<Conditions metric={null} bind:conditions={step.value.conditions}>
  <Info slot="info">
    Balance {describe(null, step.value.conditions)}

    <svelte:fragment slot="description">
      Current balance = {formatUsd(balance * 100)}
    </svelte:fragment>
  </Info>
</Conditions>
