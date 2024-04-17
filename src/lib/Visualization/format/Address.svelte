<script lang="ts">
  import { copy } from 'san-webkit/lib/utils'
  import Button from '$lib/ui/Button.svelte'

  export let value: string

  let copyLabel = 'Copy'

  function onCopyClick() {
    copyLabel = 'Copied!'
    copy(value, () => (copyLabel = 'Copy'))
  }
</script>

<wallet-address class="group flex items-center gap-1">
  <span class="expl-tooltip" aria-label={value}>
    {value.slice(0, 4)}...{value.slice(-4)}
  </span>

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
