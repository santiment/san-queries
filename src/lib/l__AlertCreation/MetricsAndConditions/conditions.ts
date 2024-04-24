import { keyify } from '$lib/utils/object'

export const Operation = keyify({
  above: {
    label: 'More than',
    describe: ([value]) => `above ${value}`,
  },
  above_or_equal: {
    label: 'More than or equal',
    describe: ([value]) => `above or equal ${value}`,
  },
  below: {
    label: 'Less than',
    describe: ([value]) => `below ${value}`,
  },
  below_or_equal: {
    label: 'Less than or equal',
    describe: ([value]) => `below or equal ${value}`,
  },
  inside_channel: {
    label: 'Entering channel',
    describe: ([left, right]) => `between ${left} and ${right}`,
  },
  outside_channel: {
    label: 'Outside channel',
    describe: ([left, right]) => `outside ${left} and ${right}`,
  },
  percent_up: {
    label: 'Moving up %',
    describe: ([value]) => `up ${value}`,
  },
  percent_down: {
    label: 'Moving down %',
    describe: ([value]) => `down ${value}`,
  },
  some_of: {
    label: 'Moving up or down %',
    describe: ([left, right]) => `up ${left} or moving down ${right}`,
  },
}) satisfies Record<
  string,
  {
    describe: (values: [string, string]) => string
  }
>

export const DUPLEX_OP = new Set<OperationValuesType>([
  Operation.inside_channel,
  Operation.outside_channel,
  Operation.some_of,
])

export const TimeRange = keyify({
  m: { label: 'Minute(s)' },
  h: { label: 'Hour(s)' },
  d: { label: 'Day(s)' },
})

type Values<T> = T[keyof T]

export type OperationValuesType = Values<typeof Operation>

export type Conditions = {
  operation: { type: OperationValuesType; values: [number, number] }
  time: { type: Values<typeof TimeRange>; value: number }
}
