<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Column, TSortController } from './state.svelte'

  import Svg from '../Svg.svelte'
  import { cn } from '../utils'
  import Filter from './Filter/index.svelte'

  let {
    column,
    children,
    sorted,
    onSortClick,
  }: {
    column: Column
    sorted: TSortController
    children: Snippet
    onSortClick?: (column: Column) => void
  } = $props()

  let isSorted = $derived(Boolean(onSortClick && sorted.column.$ === column))
</script>

<th
  class={cn(isSorted && 'text-black')}
  style={isSorted && sorted.direction.$ ? `--_${sorted.direction.$}: var(--black)` : undefined}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span
    class={cn(onSortClick && 'cursor-pointer select-none')}
    onclick={onSortClick && (() => onSortClick?.(column))}
  >
    {@render children()}

    {#if onSortClick}
      <Svg illus id="sorted" w="6" h="8" class={cn('ml-1')}></Svg>
    {/if}
  </span>

  {#if column.filter}
    <Filter {column}></Filter>
  {/if}
</th>

<style lang="postcss">
  th {
    --sorter-up: var(--_asc, var(--casper));
    --sorter-down: var(--_desc, var(--casper));
  }

  Svg {
    display: inline;
  }
</style>
