import type { Value } from './types'

import Step from './Step.svelte'
import StepValue from './StepValue.svelte'

export const NAME_AND_DESCRIPTION_STEP = {
  new: () => ({ title: '', description: '' }),
  validate() {
    this.valid = !!this.value.title
  },

  title: 'Check name and description',
  label: 'Name & Description',
  description:
    'Name and description are generated automatically, but you can change it at your will',

  Step,
  StepValue,

  parseApiAlert({ title, description }) {
    return {
      title,
      description: description || '',
    }
  },
} satisfies App.Alerts.StepSchema<Value>
