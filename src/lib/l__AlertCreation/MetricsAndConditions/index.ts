import type { Value } from './types'

import { parseIntervalString } from 'san-webkit/lib/utils/dates'
import { Metric } from 'san-studio/lib/metrics'
import Step from './Step.svelte'
import StepValue from './StepValue.svelte'
import { Operation, TimeRange } from './conditions'

export const METRICS_AND_CONDITIONS_STEP = {
  new: () => ({
    metric: null,
    conditions: {
      operation: { type: Operation.above, values: [1, 1] },
      time: { type: TimeRange.d, value: 1 },
    },
  }),
  validate() {
    const { metric, conditions } = this.value
    this.valid = !!(metric && conditions)
  },

  title: 'Choose Metric and Conditions',
  label: 'Choose Metric',
  description:
    'Depend on which asset you choose, there will be available metrics for it and the opposite...',

  Step,
  StepValue,

  parseApiAlert({ settings }) {
    const { metric, time_window, operation } = settings

    const value = this.new()

    if (metric) {
      value.metric = Metric[metric] || value.metric
    }

    if (time_window) {
      const timeWindow = parseIntervalString(time_window)
      value.conditions.time.type =
        TimeRange[timeWindow.format as keyof typeof TimeRange] || value.conditions.time.type
      value.conditions.time.value = timeWindow.amount
    }

    if (operation) {
      const operationKey = Object.keys(operation)[0] as keyof typeof Operation
      const opValue = operation[operationKey]
      value.conditions.operation.type = Operation[operationKey] || value.conditions.operation.type
      value.conditions.operation.values = (Array.isArray(opValue) ? opValue : [opValue, 1]) as [
        number,
        number,
      ]

      if (value.conditions.operation.type === Operation.some_of) {
        value.conditions.operation.values = value.conditions.operation.values.map(
          (value: any) => value.percent_up || value.percent_down || value,
        ) as [number, number]
      }
    }

    return value
  },
} satisfies App.Alerts.StepSchema<Value>
