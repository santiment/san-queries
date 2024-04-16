<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import Svg from './Svg.svelte'
  import { cn } from './utils'

  let {
    type = 'text',
    placeholder = '',
    icon,
    iconSize,
    ...rest
  }: HTMLInputAttributes & {
    type?: 'text' | 'number'
    placeholder?: string
    icon?: string
    iconSize?: number | string
  } = $props()
</script>

<div
  class="relative flex items-center rounded border fill-casper
 focus-within:border-green focus-within:fill-green
 hover:border-green
  "
>
  {#if icon}
    <Svg id={icon} w={iconSize} class="absolute left-2.5"></Svg>
  {/if}

  <input
    {...rest}
    {type}
    {placeholder}
    class={cn('w-full rounded py-[5px] pl-2.5 pr-3 outline-none', icon && 'pl-8')}
  />
</div>
