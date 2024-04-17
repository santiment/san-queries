<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'
  import type { Action } from 'svelte/action'

  import { cn } from '../utils'

  let {
    class: className,
    name,
    children,
    labelAction = () => {},
    label,
    ...props
  }: {
    class?: string
    name: string
    children: Snippet
    labelAction?: Action
    label?: Snippet
  } & HTMLLabelAttributes = $props()
</script>

<div class={cn('relative flex flex-col gap-2', className)}>
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  <label
    {...props}
    class="row items-center gap-2 text-xs font-medium text-waterloo"
    use:labelAction
  >
    {name}
    {@render label?.()}
  </label>

  {@render children()}
</div>
