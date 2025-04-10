import type { TDataWidgetKey } from '$lib-next/dashboard/types'

import { getRandomKey } from 'san-webkit-next/utils'
import {
  createDataWidgetSchema,
  type TDataWidgetNode,
  type TDataWidgetSchema,
} from '../schema/data-widget'
import Component from './ui/index.svelte'

export type TType = 'positive' | 'negative'

type TSchema = {
  name: '_asset-tweets'
  class: ''

  Component: TDataWidgetSchema['Component']

  initState(defaultState?: Record<string, any>): any

  initSettings(defaultSettings?: Partial<{ type: TType }>): {
    type: TType
  }

  initData(): { name: string; inputs: { slug: string } }

  create: TDataWidgetSchema['create']
}

export const ASSET_TWEETS_BLOCK_NODE: TDataWidgetNode<TSchema> = createDataWidgetSchema({
  name: '_asset-tweets',
  class: '',

  Component,

  initState() {
    return {}
  },

  initSettings({ type } = {}) {
    return {
      type: type || 'positive',
    }
  },

  initData() {
    return {
      name: 'Asset tweets',
      inputs: { slug: 'bitcoin' },
    }
  },

  create() {
    return {
      id: ('AssetTweets' + getRandomKey()) as TDataWidgetKey,
      type: this.name,
      settings: {},
    }
  },
} as const)
