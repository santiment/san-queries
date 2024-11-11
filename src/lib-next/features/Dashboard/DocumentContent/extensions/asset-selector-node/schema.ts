import {
  createGlobalParameterSchema,
  type TGlobalParameterNode,
  type TGlobalParameterWidgetComponent,
} from '../schema/global-parameter'
import Component from './ui/index.svelte'

type TSchema = {
  name: 'asset-selector'
  keyPrefix: 'Asset'

  rootTag: 'span'

  Component: TGlobalParameterWidgetComponent

  initOutputs(defaultOutputValues?: Partial<{ slug: string }>): { slug: string }

  initSettings(defaultSettings?: Partial<{ test: number }>): { test: number }
}

export const ASSET_SELECTOR_NODE: TGlobalParameterNode<TSchema> = createGlobalParameterSchema({
  name: 'asset-selector',
  keyPrefix: 'Asset',

  rootTag: 'span',
  class: 'inline-flex center',

  Component,

  initOutputs(defaultOutputValues = {}) {
    return { slug: defaultOutputValues.slug || 'bitcoin' }
  },

  initSettings(defaultSettings = {}) {
    return { test: defaultSettings.test || 213 }
  },
} as const)
