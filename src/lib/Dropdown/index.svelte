<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip'

  let TooltipNode: Tooltip

  export let actions = [] as [string, () => void][]

  export function close() {
    TooltipNode?.close()
  }
</script>

<Tooltip bind:this={TooltipNode} let:trigger on="click">
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
