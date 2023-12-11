<script lang="ts">
  import { copy } from 'san-webkit/lib/utils'
  import Svg from 'webkit/ui/Svg/svelte'

  export let value: string

  let copyLabel = 'Copy'

  function onCopyClick() {
    copyLabel = 'Copied!'
    copy(value, () => (copyLabel = 'Copy'))
  }
</script>

<wallet-address class="row v-center gap-s">
  <span class="expl-tooltip" aria-label={value}>
    {value.slice(0, 4)}...{value.slice(-4)}
  </span>

  <button class="btn expl-tooltip" aria-label={copyLabel} on:click={onCopyClick}>
    <Svg id="copy" w="12" />
  </button>
</wallet-address>

<style>
  wallet-address {
    --expl-left: -12px;
  }

  button {
    visibility: hidden;
    --fill-hover: var(--green);
  }

  wallet-address:hover button {
    visibility: visible;
  }
</style>
