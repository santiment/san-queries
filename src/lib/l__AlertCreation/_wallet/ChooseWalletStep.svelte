<script lang="ts">
  import { getAddressInfrastructure } from 'san-webkit/lib/utils/address'
  import AssetMovements from './AssetMovements.svelte'
  import Capitalisation from './Capitalisation.svelte'
  import { cn } from '$lib/ui/utils'
  import Button from '$lib/ui/Button.svelte'

  // export let step: App.Alerts.Step<any, any>
  export let step: App.Alerts.Step<any, any>

  const EVENTS = [
    {
      title: 'Asset Movements',
      description:
        'Track value changes of the specific asset in the particular wallet. Choose constant or percentage conditions',
      type: 'wallet_movement',
    },
    {
      title: 'Capitalisation',
      description:
        'Track the combined value of all assets in the wallet. Full capitalisation calculated as a total portfolio in USD',
      type: 'wallet_usd_valuation',
    },
    {
      title: 'Wallet Activities',
      description:
        'Track a list of assets inside the particular wallet for entering or exiting the wallet. Assets have to be with non-zero balance.',
      type: 'wallet_assets_held',
    },
  ]

  function onInput({ currentTarget }: any) {
    let input = currentTarget.value
    let address = input.trim()

    if (input.includes(',')) {
      input = input
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
      address = input[0]

      step.value.type = EVENTS[0].type
    } else {
    }

    step.value.target.address = input
    step.value.target.infrastructure = getAddressInfrastructure(address)

    if (Array.isArray(input)) {
      step.value.target.use_combined_balance = true
    } else {
      delete step.value.target.use_combined_balance
    }
  }

  const defaultValue = step.value.target.address
</script>

<div class="column mrg-xl mrg--b">
  <h4 class="caption txt-m c-waterloo row justify mb-1">
    Wallet address

    {#if step.valid}
      <Button
        href="https://app.santiment.net/labs/balance?address={step.value.target.address}"
        target="_blank"
      >
        Open Sanbase
      </Button>
    {/if}
  </h4>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="text"
    class="input rounded"
    placeholder="Type an address"
    autofocus
    on:input={onInput}
    value={defaultValue}
  />
</div>

<section class="events column mb-8">
  {#each EVENTS as item}
    {@const isInvalid =
      !step.valid || (Array.isArray(step.value.target.address) && item.type !== EVENTS[0].type)}
    <button
      class={cn('btn-2 column', isInvalid && '!bg-athens')}
      class:disabled={isInvalid}
      on:click={() => {
        step.value.type = item.type
      }}
      class:active={item.type === step.value.type}
    >
      <div class={cn('row justify', isInvalid && '!text-casper')}>
        {item.title}

        <span class="toggle" />
      </div>
      <p class="c-waterloo text-left">{item.description}</p>
    </button>
  {/each}
</section>

{#if step.value.type === EVENTS[0].type}
  <AssetMovements
    {step}
    asset={step.value.target.asset}
    onSelect={(asset) => {
      step.value.target.asset = asset
    }}
  />
{:else if step.value.type === EVENTS[1].type}
  <Capitalisation {step} />
{/if}

<style lang="scss">
  button {
    padding: 12px 16px;
    gap: 4px;
    --color: var(--black);
    --border-hover: var(--green);

    &:hover {
      .toggle {
        border-color: var(--green);
      }
    }
  }

  .events {
    gap: 12px;
  }

  .disabled {
    --color: var(--casper);
    --waterloo: var(--casper);
  }

  .toggle {
    height: 16px;
    width: 16px;
    border: 1px solid var(--porcelain);
    border-radius: 100%;
  }

  .active .toggle {
    border: 4px solid var(--green);
  }
</style>
