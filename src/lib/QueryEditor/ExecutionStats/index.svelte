<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Popover from '$lib/ui/Popover'
  import Stats from './Stats.svelte'

  type Super = ComponentProps<Popover>

  let {
    id,
    stats,
    children: trigger,
  }: {
    id?: string
    stats?: App.ExecutionStats
    children: Super['children']
  } = $props()

  const onOpenChange: Super['onOpenChange'] = ({ next }) => (stats ? next : false)
</script>

<Popover class="z-10 bg-white" {onOpenChange}>
  {#snippet children(popover)}
    {@render trigger(popover)}
  {/snippet}

  {#snippet tooltip()}
    {#if stats}
      <Stats {id} {stats}></Stats>
    {/if}
  {/snippet}
</Popover>
