import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'
import {
  createGlobalParameterSchema,
  type TGlobalParameterNode,
  type TGlobalParameterWidgetComponent,
} from '../schema/global-parameter'
import Component from './ui/index.svelte'

type TSchema = {
  name: 'controlled-list'
  keyPrefix: 'ControlledList'

  class: 'relative my-2 flex max-h-[1000px] min-h-[208px]'

  Component: TGlobalParameterWidgetComponent

  initState(defaultState?: Partial<{ value: string[] }>): { value: string[] }

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

export const CONTROLLED_LIST_BLOCK_NODE: TGlobalParameterNode<TSchema> =
  createGlobalParameterSchema({
    name: 'controlled-list',
    keyPrefix: 'ControlledList',

    class: 'relative my-2 flex max-h-[1000px] min-h-[208px]',

    Component,

    initState(defaultState = {}) {
      return { value: Array.isArray(defaultState.value) ? defaultState.value : [] }
    },

    initSettings(defaultSettings = {}) {
      return {
        linkedQuery: defaultSettings.linkedQuery,
        linkedColumn: defaultSettings.linkedColumn,
      }
    },
  } as const)
