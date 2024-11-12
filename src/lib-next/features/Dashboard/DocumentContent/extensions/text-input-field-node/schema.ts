import {
  createGlobalParameterSchema,
  type TGlobalParameterNode,
  type TGlobalParameterWidgetComponent,
} from '../schema/global-parameter'
import Component from './ui/index.svelte'

type TSchema = {
  name: 'text-input-field'
  keyPrefix: 'InputField'

  // rootTag: 'span'

  Component: TGlobalParameterWidgetComponent

  initOutputs(defaultOutputValues?: Partial<{ value: string }>): { value: string }

  initSettings(defaultSettings?: Partial<{ test: number }>): any
}

export const TEXT_INPUT_FIELD_NODE: TGlobalParameterNode<TSchema> = createGlobalParameterSchema({
  name: 'text-input-field',
  keyPrefix: 'InputField',

  // rootTag: 'span',
  class: 'inline-flex center text-sm',

  Component,

  initOutputs(defaultOutputValues = {}) {
    return { value: defaultOutputValues.value || '' }
  },

  initSettings() {
    return {}
  },
} as const)
