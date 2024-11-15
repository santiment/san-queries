import {
  createParameterWidgetSchema,
  type TParameterWidgetNode,
  type TParameterWidgetComponent,
} from '../schema/parameter-widget'
import Component from './ui/index.svelte'
import { normalizeDate } from './utils'

type TSchema = {
  name: 'date-calendar-field-node'
  keyPrefix: 'DateCalendarField'

  // rootTag: 'span'

  Component: TParameterWidgetComponent

  initOutputs(defaultOutputValues?: Partial<{ value: string }>): { value: string }
}

export const DATE_CALENDAR_FIELD_NODE: TParameterWidgetNode<TSchema> = createParameterWidgetSchema({
  name: 'date-calendar-field-node',
  keyPrefix: 'DateCalendarField',

  // rootTag: 'span',
  class: 'inline-flex center text-sm',

  Component,

  initOutputs(defaultOutputValues = {}) {
    return { value: defaultOutputValues.value || normalizeDate(new Date()).toISOString() }
  },
} as const)
