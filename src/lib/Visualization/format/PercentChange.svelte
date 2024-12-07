<script lang="ts">
  import Change, { formatPercentChange } from 'san-webkit/lib/ui/Change.svelte'
  import { cn } from '$lib/ui/utils'

  let className = ''
  export { className as class }
  export let value: number | string
</script>

{#if value === null}
  -
{:else}
  <Change
    class={cn(className, 'gap-1 text-[var(--color)]')}
    change={formatPercentChange(+value * 100)}
  />
{/if}
