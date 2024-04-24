import type { Value, Asset } from './types'

import { queryAllProjects } from 'san-studio/lib/api/project'
import SelectAssetStep from './SelectAssetStep.svelte'
import SelectAssetStepValue from './SelectAssetStepValue.svelte'
import { METRICS_AND_CONDITIONS_STEP } from '../MetricsAndConditions'

const STEPS = [
  {
    new: () => ({ target: [] }),
    validate() {
      this.valid = this.value.target.length > 0
    },

    getData: () => queryAllProjects(),

    title: 'Select Asset',
    description: 'You can create an alert for a specific asset. Choose one or multiple assets',

    Step: SelectAssetStep,
    StepValue: SelectAssetStepValue,

    parseApiAlert(alert, data) {
      const target = alert.settings.target.slug
      const slugs = new Set(Array.isArray(target) ? target : [target])

      return { target: data.filter(({ slug }) => slugs.has(slug)) }
    },
  } satisfies App.Alerts.StepSchema<Value, Asset[]>,

  METRICS_AND_CONDITIONS_STEP,
]

export const Category = {
  matchApiAlert: ({ settings: { type, target } }) => type.includes('metric_signal') && target.slug,

  title: 'Asset',
  description: 'Create an alert for the specific asset or group of assets',
  icon: 'asset-small',
  steps: STEPS,

  getSchema({ metric, target }): Schema {
    return {
      type: 'metric_signal',
      metric: metric.key,
      target: { slug: target.map(({ slug }) => slug) },
    }
  },
} as const satisfies App.Alerts.CategorySchema<Alert>

type Alert = Value & {
  metric: { key: string }
}

type Schema = {
  type: 'metric_signal'
  metric: string
  target: { slug: string[] }
}
