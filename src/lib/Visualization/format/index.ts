import { getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates'
import { formatUsd, millify } from 'san-webkit/lib/utils/formatting'
import PercentChange from './PercentChange.svelte'
import Labels from './Labels/index.svelte'
import Address from './Address.svelte'
import TimeSince from './TimeSince.svelte'

export const FormatType = {
  // NOTE: Values should not be changed!!! [@vanguard]
  NO_FORMATTER: 0,
  DATE: 1,
  MILLLIFY: 2,
  USD: 3,
  PERCENT_CHANGE: 4,
  TIME_SINCE: 5,
  ADDRESS: 6,
  LABELS: 7,
} as const

type Keyified<T> = { [K in keyof T]: T[K] & { key: K } }
export function keyify<T>(object: T): Keyified<T> {
  for (const key in object) {
    const value = object[key] as { key: string }
    value.key = key
  }
  return object as Keyified<T>
}
const Format = <K extends string, F, C>(title: K, fn: F, Component?: C) =>
  ({ title, format: fn, Component }) as const

export const Formatter = keyify({
  [FormatType.DATE]: Format('Date', dateFormatter),
  [FormatType.TIME_SINCE]: Format('Time since', undefined, TimeSince),

  [FormatType.MILLLIFY]: Format('Millify', millify),
  [FormatType.USD]: Format('USD', (value: number) => {
    const usd = formatUsd(value * 100)
    return usd.endsWith('.00') ? usd.slice(0, -3) : usd
  }),

  [FormatType.PERCENT_CHANGE]: Format('Percent change', undefined, PercentChange),

  [FormatType.ADDRESS]: Format('Address', undefined, Address),
  [FormatType.LABELS]: Format('Labels', undefined, Labels),
})

export function dateFormatter(timestamp: string | number) {
  const date = new Date(timestamp)
  const { D, MMM, YY } = getDateFormats(date)
  const { HH, mm } = getTimeFormats(date)

  return `${D} ${MMM}, ${YY} | ${HH}:${mm}`
}
