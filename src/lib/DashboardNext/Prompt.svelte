<script lang="ts">
  import type { Snippet } from 'svelte'

  import { fly } from 'svelte/transition'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { cn } from 'san-webkit-next/ui/utils'

  let { children, icon, onClick }: { children: Snippet; icon: string; onClick: () => void } =
    $props()

  function onclick(e: Event) {
    const node = (e.currentTarget as HTMLElement).parentElement!
    node.setAttribute('style', '--tw-scale-x:0;--tw-scale-y:0')
    onClick()
  }
</script>

<div
  transition:fly={{ duration: 300, y: 60 }}
  class={cn(
    'fixed bottom-[24px] left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-3xl transition-transform center active:scale-105',
  )}
>
  <button
    {onclick}
    class={cn(
      'm-[5px] flex items-center gap-2 rounded-3xl bg-casper-night fill-waterloo px-4 py-2 text-white-day hover:fill-green active:scale-105',
    )}
  >
    <Svg id={icon} w="12"></Svg>

    {@render children()}
  </button>
</div>

<style>
  div:before {
    @apply absolute -z-[1] h-[90%] w-[95%] rounded-3xl blur-[15px];
    content: '';
    background: linear-gradient(90deg, var(--lima) 0%, var(--blue) 100%);
    animation: rotate 4s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
