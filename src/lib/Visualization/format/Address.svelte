<script lang="ts">
  import { copy } from 'san-webkit/lib/utils'
  import { getAddressInfrastructure } from 'san-webkit/lib/utils/address'
  import Button from '$lib/ui/Button.svelte'

  type TProps = { value: string; row?: any[] }
  let { value, row }: TProps = $props()

  const asset = $derived(row?.[1])
  let copyLabel = 'Copy'

  function onCopyClick() {
    copyLabel = 'Copied!'
    copy(value, () => (copyLabel = 'Copy'))
  }
</script>

<wallet-address class="group flex items-center gap-1">
  {#snippet address()}
    <span class="expl-tooltip" aria-label={value}>
      {value.slice(0, 4)}...{value.slice(-4)}
    </span>
  {/snippet}

  {#if getAddressInfrastructure(value)}
    <a
      href="https://app.santiment.net/labs/balance?address={value}{asset ? '&assets=' + asset : ''}"
      target="_blank"
      class="hover:text-green"
    >
      {@render address()}
    </a>
  {:else}
    {@render address()}
  {/if}

  <Button icon="copy" iconSize="12" class="invisible group-hover:visible" onclick={onCopyClick}
  ></Button>
</wallet-address>

<style>
  wallet-address {
    --expl-left: -12px;
  }

  button {
    visibility: hidden;
    --fill-hover: var(--green);
  }
</style>
