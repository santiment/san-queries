<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Action } from 'svelte/action'

  import Svg from './Svg.svelte'
  import { cn } from './utils'

  let {
    icon,
    variant,
    children,
    class: className,
    iconSize = 16,
    iconHeight,
    iconOnRight = false,
    explanation,

    action = () => {},
    actionArgs,

    ...rest
  }: HTMLButtonAttributes & {
    href?: string
    icon?: string
    class?: string
    variant?: 'fill' | 'border' | 'ghost'
    iconSize?: number | string
    iconHeight?: number | string
    iconOnRight?: boolean
    explanation?: string

    action?: Action
    actionArgs?: any

    children?: Snippet
  } = $props()
</script>

<svelte:element
  this={rest.href ? 'a' : 'button'}
  aria-label={explanation}
  {...rest}
  use:action={actionArgs}
  class={cn(
    'flex cursor-pointer items-center gap-2',
    variant && 'rounded-md px-5 py-1.5',
    variant && icon && 'px-3',
    variant === 'fill' && 'bg-green fill-white-day text-white-day hover:bg-green-hover',
    variant === 'border' && 'border bg-white py-[5px] hover:border-green hover:fill-green',
    variant === 'ghost' && 'px-3 hover:bg-athens hover:text-green',
    iconOnRight && 'flex-row-reverse',
    !variant && !children && icon && 'size-8 justify-center hover:fill-green',
    explanation && 'expl-tooltip',
    rest.disabled && 'cursor-not-allowed bg-athens text-mystic hover:bg-athens',
    className,
  )}
>
  {#if icon}
    <Svg id={icon} w={iconSize} h={iconHeight}></Svg>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</svelte:element>
