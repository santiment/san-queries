<script context="module" lang="ts">
  import { formatUsd, millify } from 'webkit/utils/formatting'
  import { getDateFormats, getTimeFormats } from 'webkit/utils/dates'

  export const FormatType = {
    // NOTE: Values should not be changed!!! [@vanguard]
    NO_FORMATTER: 0,
    DATE: 1,
    MILLLIFY: 2,
    USD: 3,
  } as const

  type Keyified<T> = { [K in keyof T]: T[K] & { key: K } }
  export function keyify<T>(object: T): Keyified<T> {
    for (const key in object) {
      const value = object[key] as { key: string }
      value.key = key
    }
    return object as Keyified<T>
  }

  const Format = <K extends string, F>(title: K, fn: F) => ({ title, format: fn } as const)

  export const Formatter = keyify({
    [FormatType.DATE]: Format('Date', dateFormatter),
    [FormatType.MILLLIFY]: Format('Millify', millify),
    [FormatType.USD]: Format('USD', (value: number) => formatUsd(value * 100)),
  })

  export function dateFormatter(timestamp: string | number) {
    const date = new Date(timestamp)
    const { D, MMM, YY } = getDateFormats(date)
    const { HH, mm } = getTimeFormats(date)

    return `${D} ${MMM}, ${YY} | ${HH}:${mm}`
  }
</script>

<script lang="ts">
  import Control from '../Control.svelte'

  export let column: string
  export let type: string
  export let settings: Record<string, any>
  export let update: any

  $: options = getFormatters(column, type)

  function getFormatters(_column: string, type: string) {
    if (type.includes('Date')) {
      return [Formatter[FormatType.DATE]]
    }

    if (type.includes('Int') || type.includes('Float')) {
      return [Formatter[FormatType.MILLLIFY], Formatter[FormatType.USD]]
    }

    return []
  }
</script>

<Control
  name="Format"
  {options}
  value={settings.formatter}
  defaultValue={'No formatting'}
  onUpdate={(option) => {
    settings.formatter = option
    console.log('updated')
    update(column, settings)
  }}
  let:option
>
  {option.title}
</Control>

<style>
</style>
