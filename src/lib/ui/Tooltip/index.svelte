<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { StoresValues } from 'svelte/store'

  import { createTooltip, melt } from '@melt-ui/svelte'
  import { fade } from 'svelte/transition'
  import { cn } from '../utils'

  let {
    children,
    tooltip,
    class: className,
  }: {
    class?: string

    children: Snippet<
      [
        {
          trigger$: typeof trigger
          trigger: StoresValues<typeof trigger>
          isOpened: boolean
        },
      ]
    >
    tooltip: Snippet
  } = $props()

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createTooltip({
    positioning: {
      placement: 'top',
    },
    openDelay: 0,
    closeDelay: 0,
    closeOnPointerDown: false,
    forceVisible: true,
  })
</script>

{@render children({ trigger: $trigger, trigger$: trigger, isOpened: $open })}

{#if $open}
  <div
    use:melt={$content}
    transition:fade={{ duration: 100 }}
    class={cn('z-10 flex flex-col rounded border  bg-white shadow', className)}
  >
    {@render tooltip()}
  </div>
{/if}
