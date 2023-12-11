<script lang="ts">
  export let value: string

  $: console.log($$props)

  $: labels = Array.isArray(value) ? value : (value || '').split(',').map((label) => label.trim())
</script>

<labels class="row gap-xs">
  {#each labels as label}
    <span class="caption">{label}</span>
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
</style>
