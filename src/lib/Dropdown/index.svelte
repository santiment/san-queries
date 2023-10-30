<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip'

  export let actions = [] as [string, () => void][]
</script>

<Tooltip let:trigger on="click">
  <slot {trigger} />

  <svelte:fragment slot="tooltip">
    {#each actions as [title, onClick]}
      <button class="btn-ghost" on:click={onClick}>{title}</button>
    {/each}
  </svelte:fragment>
</Tooltip>

<style>
  Tooltip {
    padding: 8px;
  }
</style>
