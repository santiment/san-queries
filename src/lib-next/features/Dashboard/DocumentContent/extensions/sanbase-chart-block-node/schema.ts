import Component from './ui/index.svelte'
import {
  createDataWidgetSchema,
  type TDataWidgetComponent,
  type TDataWidgetNode,
} from '../schema/data-widget'

type TSchema = TDataWidgetNode<{
  name: 'sanbase-chart'
  class: 'relative my-2 flex max-h-[1000px] min-h-[450px]'

  Component: TDataWidgetComponent

  initState(defaultState?: Record<string, any>): any

  initData(): { name: string; inputs: { slug: string; from: string; to: string } }
}>

export const SANBASE_CHART_BLOCK_NODE: TSchema = createDataWidgetSchema({
  name: 'sanbase-chart',
  class: 'relative my-2 flex max-h-[1000px] min-h-[450px]',

  Component,

  initState(defaultState = {}) {
    return {}
  },

  initData() {
    return {
      name: 'Sanbase Chart',
      inputs: { slug: '', from: '', to: '' },
    }
  },
} as const)