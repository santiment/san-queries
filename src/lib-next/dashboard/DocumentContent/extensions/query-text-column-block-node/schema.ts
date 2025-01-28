import type { TDataWidgetKey } from '$lib-next/dashboard/types'

import { getRandomKey } from 'san-webkit-next/utils'
import {
  createDataWidgetSchema,
  type TDataWidgetNode,
  type TDataWidgetSchema,
} from '../schema/data-widget'
import Component from './ui/index.svelte'


type TSchema = {
  name: 'query-text-column',
  class: ''

  Component: TDataWidgetSchema['Component']

  initState(defaultSettings?: Partial<{
    linkedQuery: TDataWidgetKey,
    linkedColumn: string
  }>): {
    linkedQuery: undefined | TDataWidgetKey,
    linkedColumn: undefined | string
  }

  initSettings(defaultSettings?: Partial<{
    linkedQuery: TDataWidgetKey,
    linkedColumn: string
  }>): {
    linkedQuery: undefined | TDataWidgetKey,
    linkedColumn: undefined | string
  }

  initData(): { name: string; }

  create: TDataWidgetSchema['create']
}

export const QUERY_TEXT_COLUMN_BLOCK_NODE: TDataWidgetNode<TSchema> = createDataWidgetSchema({
  name: 'query-text-column',
  class: '',

  Component,

  initState({ linkedQuery, linkedColumn } = {}) {
    return { linkedQuery, linkedColumn, }
  },

  initSettings({ linkedQuery, linkedColumn } = {}) {
    return { linkedQuery, linkedColumn }
  },

  initData() {
    return {
      name: 'Query Text column block',
      //inputs: {},
    }
  },

  create() {
    return {
      id: ('QueryTextColumn' + getRandomKey()) as TDataWidgetKey,
      type: this.name,
      settings: {},
    }
  },
} as const)
