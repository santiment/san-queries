<script lang="ts">
  import Svg from '../../Svg.svelte'
  import { cn } from '../../utils'
  import Popover from '../../Popover'
  import NumberFilter from './NumberFilter.svelte'

  import { useTableFilter } from './state.svelte'
  import type { FilterSchemeType } from './types'

  import SearchFilter from './SearchFilter.svelte'
  import type { Column } from '..'

  let { column }: { column: Column } = $props()

  const { columnFilter, applyFilter } = useTableFilter.getCtx()

  const filter = $derived(columnFilter.get(column.title))
</script>

<Popover class="flex-col gap-2" portal={null}>
  {#snippet children({ trigger, action, open })}
    <button
      use:action={trigger}
      class={cn(
        'ml-1 fill-waterloo hover:fill-green',
        open.$ && 'fill-green',
        filter?.value && 'fill-green',
      )}
    >
      <Svg id={filter?.value ? 'filter-filled' : 'filter'} w="8"></Svg>
    </button>
  {/snippet}

  {#snippet tooltip()}
    {#if filter}
      {@const { type, value } = filter}
      {@const onChange = (newValue: FilterSchemeType['value']) =>
        applyFilter(column.title, newValue)}

      {#if type === 'number'}
        <NumberFilter {value} {onChange}></NumberFilter>
      {:else if type === 'search'}
        <SearchFilter {value} {onChange}></SearchFilter>
      {/if}
    {/if}
  {/snippet}
</Popover>
