import {
  createGlobalParameterSchema,
  type TGlobalParameterNode,
  type TGlobalParameterWidgetComponent,
} from '../schema/global-parameter'
import Component from './Component.svelte'

type T_ASSET_SELECTOR_NODE = {
  name: 'asset-selector'
  keyPrefix: 'Asset'

  rootTag: 'span'

  Component: TGlobalParameterWidgetComponent

  initState(defaultState?: Partial<{ slug: string }>): { slug: string }

  initSettings(defaultSettings?: Partial<{ test: number }>): { test: number }
}

export const ASSET_SELECTOR_NODE: TGlobalParameterNode<T_ASSET_SELECTOR_NODE> =
  createGlobalParameterSchema({
    name: 'asset-selector',
    keyPrefix: 'Asset',

    rootTag: 'span',

    Component,

    initState(defaultState = {}) {
      return { slug: defaultState.slug || 'bitcoin' }
    },

    initSettings(defaultSettings = {}) {
      return { test: defaultSettings.test || 213 }
    },
  } as const)
