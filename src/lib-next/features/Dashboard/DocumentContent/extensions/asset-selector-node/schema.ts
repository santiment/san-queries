import { createGlobalParameterSchema } from '../schema'

export const ASSET_SELECTOR_NODE = createGlobalParameterSchema({
  name: 'asset-selector',
  keyPrefix: 'Asset',

  initState(defaultState: Partial<{ slug: string }> = {}) {
    return { value: defaultState.slug || 'bitcoin' }
  },

  initSettings(defaultSettings: Partial<{ test: number }> = {}) {
    return { test: defaultSettings.test || 213 }
  },
} as const)
