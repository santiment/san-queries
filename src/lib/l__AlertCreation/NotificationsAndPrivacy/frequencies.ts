import { keyify } from '$lib/utils/object'

export const Frequency = keyify({
  // NOTE: Looks like once_per doesn't have an affect [@vanguard | 22 Mar, 2023]
  once_per: { label: 'No more than once per', name: 'once' },
  m: { label: 'Minutely', name: 'minute' },
  h: { label: 'Hourly', name: 'hour' },
  d: { label: 'Daily', name: 'day' },
  w: { label: 'Weekly', name: 'week' },
})

export type FrequencyType = typeof Frequency

export type FrequencyKey = keyof FrequencyType

export type FrequencyValue = FrequencyType[FrequencyKey]
