import type { TDataWidgetKey } from '$lib-next/dashboard/types'
import {
  createParameterWidgetSchema,
  type TParameterWidgetNode,
  type TParameterWidgetComponent,
} from '../schema/parameter-widget'
import Component from './ui/index.svelte'

type TSchema = {
  name: 'controlled-list'
  keyPrefix: 'ControlledList'

  class: 'relative my-2 flex max-h-[1000px] min-h-[208px]'

  Component: TParameterWidgetComponent

  initOutputs(defaultOutputValues?: Partial<{ value: string[] }>): { value: string[] }

  initSettings(
    defaultSettings?: Partial<{
      linkedQuery: TDataWidgetKey
      linkedColumn: number | string
    }>,
  ): {
    linkedQuery: undefined | TDataWidgetKey
    linkedColumn: undefined | number | string
  }
}

export const CONTROLLED_LIST_BLOCK_NODE: TParameterWidgetNode<TSchema> =
  createParameterWidgetSchema({
    name: 'controlled-list',
    keyPrefix: 'ControlledList',

    class: 'relative my-2 flex max-h-[1000px] min-h-[208px]',

    Component,

    initOutputs(defaultOutputValues = {}) {
      return { value: Array.isArray(defaultOutputValues.value) ? defaultOutputValues.value : [] }
    },

    initSettings(defaultSettings = {}) {
      return {
        linkedQuery: defaultSettings.linkedQuery,
        linkedColumn: defaultSettings.linkedColumn,
      }
    },
  } as const)
