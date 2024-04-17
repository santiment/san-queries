<script lang="ts">
  import cex from './cex.svg'
  import dex from './dex.svg'
  import contract from './contract.svg'
  import whale from './whale.svg'

  const IMG = { whale, cex, dex, contract }
  const Index = Object.keys(IMG).reduce((acc, key, i) => Object.assign(acc, { [key]: i }), {})

  export let value: string

  $: labels = Array.isArray(value)
    ? value.filter((v) => v)
    : (value || '')
        .trim()
        .split(',')
        .map((label) => label.trim())

  $: sorted = labels.slice().sort((a, b) => (Index[a] ?? 99) - (Index[b] ?? 99))
</script>

<labels class="flex items-center gap-1">
  {#each sorted as label}
    {#if IMG[label]}
      <div class="expl-tooltip mr-1" aria-label={label}>
        <img src={IMG[label]} alt="Label" />
      </div>
    {:else}
      <span class="text-xs">{label}</span>
    {/if}
  {/each}
</labels>

<style>
  labels {
    /* flex-wrap: wrap; */
  }

  span {
    line-height: 21px;
    background: var(--porcelain);
    padding: 1px 8px;
    min-width: 24px;
    min-height: 24px;
    border-radius: 4px;
    display: inline-block;
  }

  div {
    --expl-left: 50%;
    --expl-align-x: -50%;
  }
</style>
