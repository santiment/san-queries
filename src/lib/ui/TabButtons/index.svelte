<script module lang="ts">
  export type Tab = {
    title: string
    description?: string
  }
</script>

<script lang="ts">
  // import { trackEvent } from 'san-webkit-next/analytics'

  import { cn } from 'san-webkit-next/ui/utils'
  import OnlyOnDevice from 'san-webkit-next/ui/utils/OnlyOnDevice'
  import Button from '../Button.svelte'

  type T = $$Generic<any>

  type TProps = {
    class?: string
    tabs: T[]
    active: T
    // source?: string
  }

  let { class: className = '', tabs, active = $bindable() }: TProps = $props()

  function onTabClick(tab: T) {
    active = tab

    // trackEvent('tab_change', {
    //   category: 'Interaction',
    //   source,
    //   type: (tab as any).type,
    // })
  }
</script>

<div class={cn('flex whitespace-nowrap text-base font-medium no-scrollbar', className)}>
  <div class="flex gap-0.5 rounded-lg">
    {#each tabs as tab}
      {@const { title, description } = tab as any}

      <Button
        variant="ghost"
        class={cn(
          'px-5 text-fiord transition-all duration-300 hover:text-fiord',
          tab === active && 'bg-athens text-black hover:text-black',
        )}
        onclick={() => onTabClick(tab)}
      >
        {title}

        {#if description}
          <OnlyOnDevice desktop tablet>
            <p class="mt-1 whitespace-normal text-sm font-normal text-waterloo">
              {description}
            </p>
          </OnlyOnDevice>
        {/if}
      </Button>
    {/each}
  </div>
</div>
