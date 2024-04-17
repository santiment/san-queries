<script lang="ts" generics="T, K extends undefined | string">
  import type { Snippet } from 'svelte'

  import { melt, createSelect, type SelectOption } from '@melt-ui/svelte'
  import Button from '$lib/ui/Button.svelte'
  import Field from './Field.svelte'
  import { cn } from '../utils'

  let {
    dropdownClass,

    name,
    options,
    value,
    onChange,
    defaultValue = '',
    children = childrenDefault,
  }: {
    dropdownClass?: string

    name: string
    options: readonly T[]
    onChange: K extends string ? (option: T | null) => void : (option: T) => void
    value?: T
    defaultValue?: K
    children?: Snippet<[{ option: T }]>
    defaultOption?: Snippet<[{ Option: typeof Option }]>
  } = $props()

  function onSelectedChange({
    next,
    curr,
  }: {
    next: SelectOption<T> | undefined
    curr: SelectOption<T> | undefined
  }) {
    if (next && next.label !== curr?.label) onChange(next.value)

    return next?.value ? next : undefined
  }

  const {
    elements: { trigger, menu, option, label }, // group, groupLabel, },
    states: { selected, open },
    // helpers: { isSelected },
  } = createSelect<T>({
    onSelectedChange,
    defaultSelected: value && { value },
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true,
    },
  })

  $effect(() => {
    if (value) selected.set({ value })
  })
</script>

{#snippet childrenDefault({option}: {option:T})}
  {option}
{/snippet}

<Field {name} {...$label} labelAction={label}>
  <Button
    {...$trigger}
    action={trigger}
    icon="arrow-down"
    iconSize="8"
    iconOnRight
    variant="border"
    class="justify-between"
  >
    {#if $selected}
      {@render children({ option: $selected.value })}
    {:else}
      <span class="text-casper opacity-50">{defaultValue}</span>
    {/if}
  </Button>

  {#if $open}
    <div
      class={cn(
        'z-10 flex max-h-[300px] flex-col rounded border bg-white p-2 shadow-xl',
        dropdownClass,
      )}
      use:melt={$menu}
    >
      {#if defaultValue}
        {@render Option({ item: undefined })}
      {/if}

      {#each options as item}
        {@render Option({ item, children })}
      {/each}
    </div>
  {/if}
</Field>

{#snippet Option({ item, children })}
  <Button
    {...$option({ value: item })}
    variant="ghost"
    action={option}
    class="hover:bg-transparent hover:text-black data-[highlighted]:bg-athens data-[highlighted]:text-green"
  >
    {#if children}
      {@render children({ option: item })}
    {:else}
      {defaultValue}
    {/if}
  </Button>
{/snippet}
