<script lang="ts">
  import type { Snippet } from 'svelte'

  import Svg from 'san-webkit-next/ui/core/Svg'
  import { cn } from 'san-webkit-next/ui/utils'

  type TProps = { class?: string; children: Snippet }
  let { children, class: className }: TProps = $props()
</script>

<div
  class={cn(
    'items-center gap-2 rounded border border-blue bg-blue-light-1 fill-blue p-3 row',
    className,
  )}
>
  <Svg id="info" w="16"></Svg>

  {@render children()}
</div>
