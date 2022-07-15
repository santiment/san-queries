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

  const options = Object.values(Formatter)

  function dateFormatter(date) {
    const { D, MMM, YY } = getDateFormats(new Date(date))
    return `${D} ${MMM}, ${YY}`
  }
</script>

<script>
  import Field from 'webkit/ui/Field/Select.svelte'
  export let i
  export let column

  $: selected = Formatter[column.formatterId || 0]

  function onSelect({ id, fn }) {
    column.format = fn ? (data) => fn(column.accessor(data)) : column.accessor
    column.formatter = fn
    column.formatterId = id
  }
</script>

<Field title={`Column ${i}: Format`} bind:selected {options} {onSelect} class="mrg-xl mrg--b">
  {selected.title}

  <svelte:fragment slot="option" let:option>
    {option.title}
  </svelte:fragment>
</Field>
