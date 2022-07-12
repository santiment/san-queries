<script context="module" lang="ts">
  import { formatUsd, millify } from 'webkit/utils/formatting'
  import { getDateFormats } from 'webkit/utils/dates'

  export const FormatType = {
    // NOTE: Values should not be changed!!! [@vanguard]
    NO_FORMATTER: 0,
    DATE: 1,
    MILLLIFY: 2,
    USD: 3,
  } as const

  const Format = (id: number, title: string, fn?: any) => ({
    [id]: { id, title, fn },
  })
  export const Formatter = Object.assign(
    Format(FormatType.NO_FORMATTER, 'No formatting'),
    Format(FormatType.DATE, 'Date', dateFormatter),
    Format(FormatType.MILLLIFY, 'Millify', millify),
    Format(FormatType.USD, 'USD', formatUsd),
  )

  function dateFormatter(date) {
    const { D, MMM, YY } = getDateFormats(new Date(date))
    return `${D} ${MMM}, ${YY}`
  }
</script>

<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Field from '@/Field.svelte'
  export let i
  export let column

  let isOpened = false

  function onSelect({ id, fn }) {
    column.format = fn ? (data) => fn(column.accessor(data)) : column.accessor
    column.formatterId = id
    isOpened = false
  }
</script>

<Field
  title={`Column ${i}: Format`}
  placeholder={column.title}
  bind:value={column.title}
  let:classes>
  <div class="relative">
    <Tooltip on="click" class="$style.tooltip" bind:isOpened>
      <button slot="trigger" class="btn-2 btn--s {classes} row v-center justify">
        {Formatter[column.formatterId || 0].title}

        <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
      </button>

      <div slot="tooltip" class="column">
        {#each Object.values(Formatter) as formatter}
          <button
            class="btn-ghost txt-left"
            class:active={(column.formatterId || 0) === formatter.id}
            on:click={() => onSelect(formatter)}>{formatter.title}</button>
        {/each}
      </div>
    </Tooltip>
  </div>
</Field>

<style>
  .tooltip {
    padding: 8px;
    width: 100%;
  }

  .active {
    --color: var(--green);
  }
</style>
