import type { TDataWidgetKey } from '$lib-next/dashboard/types'

import { Metric as M } from 'san-studio/lib/metrics'
import { getRandomKey } from 'san-webkit-next/utils'
import {
  createDataWidgetSchema,
  type TDataWidgetNode,
  type TDataWidgetSchema,
} from '../schema/data-widget'
import Component from './ui/index.svelte'

type TSchema = {
  name: 'sanbase-chart'
  class: 'relative my-2 flex max-h-[1000px] min-h-[450px]'

  Component: TDataWidgetSchema['Component']

  initState(defaultState?: Record<string, any>): any

  initSettings(defaultSettings?: Partial<{ metrics: { name: string; style: 'line' }[] }>): {
    metrics: { name: string; style: 'line' }[]
  }

  initData(): { name: string; inputs: { slug: string; from: string; to: string } }

  create: TDataWidgetSchema['create']
}

const DEFAULT_METRICS = [
  {
    name: M.price_usd.key as string,
    style: 'line' as const,
  },
]
export const SANBASE_CHART_BLOCK_NODE: TDataWidgetNode<TSchema> = createDataWidgetSchema({
  name: 'sanbase-chart',
  class: 'relative my-2 flex max-h-[1000px] min-h-[450px]',

  Component,

  initState(defaultState = {}) {
    return {}
  },

  initSettings({ metrics } = {}) {
    return {
      metrics: metrics || DEFAULT_METRICS,
    }
  },

  initData() {
    return {
      name: 'Sanbase Chart',
      inputs: { slug: 'bitcoin', from: 'utc_now-60d', to: 'utc_now' },
    }
  },

  create() {
    return {
      id: ('SanbaseChart' + getRandomKey()) as TDataWidgetKey,
      type: this.name,
      settings: { metrics: DEFAULT_METRICS },
    }
  },
} as const)
