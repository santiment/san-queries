<script lang="ts">
  import Button from '$lib/ui/Button.svelte'
  import { cn } from '$lib/ui/utils'
  import ExecutionStats from './ExecutionStats'

  let { id, stats }: { id?: string; stats: App.ExecutionStats } = $props()
</script>

<ExecutionStats {id} {stats}>
  {#snippet children({ trigger, action, open })}
    <Button
      variant="fill"
      class={cn(
        'mr-4 bg-athens text-waterloo hover:bg-athens hover:text-green',
        open.$ && 'text-black',
      )}
      {action}
      actionArgs={trigger}
    >
      Last execution took {stats.queryDurationMs || 1} ms
    </Button>
  {/snippet}
</ExecutionStats>
