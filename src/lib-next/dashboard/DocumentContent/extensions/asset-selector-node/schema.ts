import {
  createParameterWidgetSchema,
  type TParameterWidgetNode,
  type TParameterWidgetComponent,
} from '../schema/parameter-widget'
import Component from './ui/index.svelte'

type TSchema = {
  name: 'asset-selector'
  keyPrefix: 'Asset'

  // rootTag: 'span'

  Component: TParameterWidgetComponent

  initOutputs(defaultOutputValues?: Partial<{ slug: string }>): { slug: string }

  initSettings(defaultSettings?: Partial<{ slugsByText: string[] }>): {
    slugsByText: undefined | string[]
  }
}

export const ASSET_SELECTOR_NODE: TParameterWidgetNode<TSchema> = createParameterWidgetSchema({
  name: 'asset-selector',
  keyPrefix: 'Asset',

  // rootTag: 'span',
  class: 'inline-flex center',

  Component,

  initOutputs(defaultOutputValues = {}) {
    return { slug: defaultOutputValues.slug || 'bitcoin' }
  },

  initSettings(defaultSettings = {}) {
    return { slugsByText: defaultSettings.slugsByText }
  },
} as const)
