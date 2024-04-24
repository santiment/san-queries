<script lang="ts">
  import { DUPLEX_OP } from './conditions'

  import { Operation, TimeRange } from './conditions'
  import Input from './Input.svelte'
  import { describe, getOperationSign } from './utils'
  import Dropdown from '../Dropdown.svelte'

  export let conditions: App.Alerts.Conditions
  // export let metric: null | App.Alerts.Metric
  export let metric: any

  $: isDuplex = DUPLEX_OP.has(conditions.operation.type)
  $: sign = getOperationSign(metric, conditions.operation.type)
</script>

<slot />

<h4 class="mb-6 text-lg">Conditions</h4>

<slot name="info" />

<form class="grid">
  <Dropdown
    class={isDuplex ? '$style.duplex' : ''}
    selected={conditions.operation.type}
    options={Object.values(Operation)}
    onSelect={(selection) => (conditions.operation.type = selection)}
    let:option
  >
    {option.label}
  </Dropdown>

  <Input {sign} bind:value={conditions.operation.values[0]} />

  {#if isDuplex}
    <Input {sign} bind:value={conditions.operation.values[1]} />
  {/if}

  <input bind:value={conditions.time.value} type="number" min="0" class="input border" />

  <Dropdown
    selected={conditions.time.type}
    options={Object.values(TimeRange)}
    onSelect={(selection) => (conditions.time.type = selection)}
    let:option
  >
    {option.label}
  </Dropdown>
</form>

{#if !$$slots.info}
  <div class="c-fiord txt-m mrg-l mrg--t">
    {describe(metric, conditions)}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 8px;
  }

  .duplex {
    grid-column: 3 / 1;
  }
</style>
