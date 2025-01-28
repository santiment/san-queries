import type { TDataWidgetKey } from '$lib-next/dashboard/types'

import { getRandomKey } from 'san-webkit-next/utils'
import {
  createDataWidgetSchema,
  type TDataWidgetNode,
  type TDataWidgetSchema,
} from '../schema/data-widget'
import Component from './ui/index.svelte'

export type TField = 'price' | 'marketcap' | 'description' | 'bb-meter'

type TSchema = {
  name: '_asset-info'
  class: ''

  Component: TDataWidgetSchema['Component']

  initState(defaultSettings?: Partial<{ fields: TField[] }>): {
    fields: Set<TField>
  }

  initSettings(defaultSettings?: Partial<{ fields: TField[] }>): {
    fields: TField[]
  }

  initData(): { name: string; inputs: { slug: string } }

  create: TDataWidgetSchema['create']
}

export const ASSET_INFO_BLOCK_NODE: TDataWidgetNode<TSchema> = createDataWidgetSchema({
  name: '_asset-info',
  class: '',

  Component,

  initState({ fields } = {}) {
    return {
      fields: new Set((Array.isArray(fields) && fields) || ['price', 'marketcap', 'description']),
    }
  },

  initSettings({ fields } = {}) {
    return {
      fields: (Array.isArray(fields) && fields) || ['price', 'marketcap', 'description'],
    }
  },

  initData() {
    return {
      name: 'Asset info',
      inputs: { slug: 'bitcoin' },
    }
  },

  create() {
    return {
      id: ('AssetInfo' + getRandomKey()) as TDataWidgetKey,
      type: this.name,
      settings: {},
    }
  },
} as const)
