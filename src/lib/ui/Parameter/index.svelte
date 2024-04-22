<script lang="ts">
  import type { Snippet } from 'svelte'
  import Button from '../Button.svelte'

  let {
    global = false,
    isAuthor = false,
    color,

    parameter,
    onEditClick,
    onLinkClick,
    onRemoveClick,

    children,
  }: {
    global?: boolean
    isAuthor?: boolean
    color?: string

    parameter: { key: string; value: string | number; type?: any }
    onEditClick?: () => void
    onLinkClick?: () => void
    onRemoveClick?: () => void

    children?: Snippet
  } = $props()

  let shortValue = $derived(parameter.value.toString())
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
    {shortValue.length > 10 ? `${shortValue.slice(0, 4)}...${shortValue.slice(-3)}` : shortValue}
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

  {#if children}
    {@render children()}
  {/if}
</section>
