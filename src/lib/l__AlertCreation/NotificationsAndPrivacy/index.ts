import type { Value } from './types'

import { parseIntervalString } from 'san-webkit/lib/utils/dates'
import Step from './Step.svelte'
import StepValue from './StepValue.svelte'
import { Frequency } from './frequencies'
import { filterValidSources } from './utils'

export const NOTIFICATIONS_AND_PRIVACY_STEP = {
  new: () => ({
    cooldown: { value: 1, type: Frequency.m },
    channel: {},
    isPublic: false,
    isRepeating: true,
  }),
  validate() {
    this.valid = filterValidSources(this.value.channel).length > 0
  },

  title: 'Set up Notifications and Privacy',
  label: 'Notification & Privacy',
  description: 'Choose one or multiple alert methods',

  Step,
  StepValue,

  parseApiAlert({ cooldown = '1d', isPublic, isRepeating, settings }) {
    const { channel = [] } = settings
    const { amount, format } = parseIntervalString(cooldown)

    return {
      cooldown: { value: amount, type: Frequency[format as keyof typeof Frequency] },
      channel: channel.reduce(
        (acc, source) => {
          if (typeof source === 'string') {
            acc[source as 'email' | 'telegram'] = true
          } else {
            Object.assign(acc, source)
          }

          return acc
        },
        {} as Value['channel'],
      ),
      isPublic,
      isRepeating,
    }
  },
} satisfies App.Alerts.StepSchema<Value>
