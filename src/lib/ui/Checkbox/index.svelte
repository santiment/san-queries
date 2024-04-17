<script lang="ts">
  import type { ChangeFn } from '@melt-ui/svelte/internal/helpers'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import { createCheckbox, melt } from '@melt-ui/svelte'
  import { cn } from '../utils'

  let {
    onChange,
    value = false,
    ...rest
  }: {
    value?: boolean
    onChange?: (next: boolean, current: boolean) => void | boolean
  } & Omit<HTMLButtonAttributes, 'value'> = $props()

  const {
    states: { checked },
    elements: { root, input },
    helpers: { isChecked },
  } = createCheckbox({ onCheckedChange, defaultChecked: value })

  function onCheckedChange({ curr, next }: Parameters<ChangeFn<boolean | 'indeterminate'>>[0]) {
    const value = onChange?.(!!next, !!curr)
    return value ?? next
  }

  $effect(() => {
    if (onChange) return

    checked.set(value)
  })
</script>

<button
  {...rest}
  use:melt={$root}
  class={cn(
    'h-4 w-4 min-w-4 rounded border border-porcelain bg-white hover:border-green',
    $isChecked &&
      'border-green bg-green bg-[url(/webkit/icons/checkmark.svg)] bg-center bg-no-repeat hover:bg-green-hover',
  )}
>
  <input use:melt={$input} />
</button>
