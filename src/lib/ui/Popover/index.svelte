<script lang="ts">
  import { type Snippet } from 'svelte'
  import type { FloatingConfig } from '@melt-ui/svelte/internal/actions'
  import type { MeltElement } from '@melt-ui/svelte/internal/helpers'

  import { fade } from 'svelte/transition'
  import { createPopover, melt, type CreatePopoverProps } from '@melt-ui/svelte'
  import { cn } from '../utils'
  import { ss, useStore } from 'svelte-runes'

  let {
    children,
    tooltip,
    class: className,

    portal,

    placement = 'bottom',
    onOpenChange,
  }: {
    portal?: null
    class?: string
    placement?: NonNullable<FloatingConfig>['placement']
    onOpenChange?: CreatePopoverProps['onOpenChange']

    children: Snippet<
      [
        {
          trigger: typeof trigger
          content: typeof content
          close: typeof close
          open: typeof open
          action: typeof action
        },
      ]
    >
    tooltip: Snippet<[{ close: typeof close; action: typeof action; open: typeof open }]>
  } = $props()

  const {
    states,
    elements: { trigger, content, close },
  } = createPopover({
    portal,
    forceVisible: true,
    onOpenChange,
    positioning: { placement },
  })

  let open = useStore(states.open)

  function action(node: HTMLElement, store: MeltElement<any, any, any, any>) {
    let meltAction = null as
      | null
      | Parameters<Parameters<(typeof trigger)['subscribe']>[0]>[0]['action']

    const unsub = store.subscribe(({ action, ...attrs }) => {
      meltAction = action

      Object.keys(attrs).forEach((key) => node.setAttribute(key, attrs[key]))
    })

    const state = meltAction?.(node)

    return {
      destroy() {
        unsub()
        state?.destroy?.()
        console.log('Popup Destroyed')
      },
    }
  }
</script>

{@render children({ trigger, content, close, open, action })}

{#if open.$}
  <div
    use:melt={$content}
    class={cn('flex rounded border bg-white p-2 !opacity-100 shadow', className)}
    transition:fade={{ duration: 65 }}
  >
    {@render tooltip({ close, action, open })}
  </div>
{/if}
