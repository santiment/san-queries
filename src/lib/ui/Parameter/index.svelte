<script lang="ts">
  import type { Snippet } from 'svelte'
  import Button from '../Button.svelte'

  let {
    global = false,
    isAuthor = false,
    color,

    parameter,
    changedValue,

    onEditClick,
    onLinkClick,
    onRemoveClick,

    children,
  }: {
    global?: boolean
    isAuthor?: boolean
    color?: string

    parameter: { key: string; value: string | number; type?: any }
    changedValue?: any

    onEditClick?: () => void
    onLinkClick?: () => void
    onRemoveClick?: () => void

    children?: Snippet
  } = $props()

  let currentValue = $derived(changedValue || parameter.value)
  $effect(() => {
    console.log({ changedValue, v: parameter.value })
  })
  let shortValue = $derived(currentValue.toString())
  let shortValues = $derived(
    shortValue
      .split(',')
      .map((value: string) =>
        value.length > 10 ? `${value.slice(0, 4)}...${value.slice(-3)}` : value,
      )
      .join(', '),
  )
</script>

<section
  class="relative flex min-h-8 items-center rounded-md rounded-l-sm border bg-white pl-2 pr-1"
>
  {#if color}
    <color
      style="--color:{color}"
      class="absolute bottom-[-1px] left-[-1px] top-[-1px] w-0.5 rounded-l-md bg-[var(--color)]"
    ></color>
  {/if}

  {#if global}
    <span class="mr-2 rounded-sm bg-orange-light-1 px-1 text-xs font-medium text-orange">GP</span>
  {/if}

  {parameter.key}

  <span class="ml-2 text-waterloo">
    {shortValues}
  </span>

  {#if onEditClick || onLinkClick || (isAuthor && onRemoveClick)}
    <div class="ml-3 mr-1 h-full border-l"></div>
  {/if}

  {#if onEditClick}
    <Button icon="pencil" iconSize="14" onclick={onEditClick}></Button>
  {/if}

  {#if onLinkClick}
    <Button icon="link" iconSize="15" onclick={onLinkClick}></Button>
  {/if}

  {#if isAuthor && onRemoveClick}
    <Button icon="close" iconSize="10" onclick={onRemoveClick}></Button>
  {/if}

  {#if changedValue}
    <span
      class="absolute right-[-5px] top-[-10px] rounded-sm bg-green-light-1 px-1 text-[10px] text-green"
    >
      Changed
    </span>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</section>
