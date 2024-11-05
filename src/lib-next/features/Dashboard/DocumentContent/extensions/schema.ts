import type { Component } from 'svelte'
import { SvelteNodeViewRenderer, type ViewProps } from 'tiptap-svelte-adapter'
import GenericNodeView from './GenericNodeView.svelte'

type TGlobalParameterSchema = {
  name: string
  keyPrefix: string

  /** Will be uploaded to API */
  initState(defaultState?: Partial<{ [key: string]: unknown }>): { [key: string]: unknown }

  /** Will be uploaded to API */
  initSettings?: (defaultSettings?: Partial<{ [key: string]: unknown }>) => {
    [key: string]: unknown
  }
}

export function createGlobalParameterSchema<GSchema extends TGlobalParameterSchema>(
  schema: GSchema,
) {
  return {
    isGlobalParameter: true,

    name: schema.name as GSchema['name'],
    keyPrefix: schema.keyPrefix as GSchema['keyPrefix'],

    initState: schema.initState as GSchema['initState'],
    initSettings: schema.initSettings as GSchema['initSettings'],
  } as const
}
export type TGlobalParameterNode = ReturnType<typeof createGlobalParameterSchema>

//

type TDataWidgetSchema = {
  name: string

  Component: Component<any>

  /** Will be uploaded to API */
  data?: unknown

  /** Will be uploaded to API */
  initSettings?: (defaultSettings?: Partial<{ [key: string]: unknown }>) => {
    [key: string]: unknown
  }

  /** Will NOT be uploaded to API */
  initState(defaultState?: Partial<{ [key: string]: unknown }>): { [key: string]: unknown }

  /**
   * This function will run only once on component initialization. It's safe to use `getContext` here.
   *
   * Promise will render `Loader`.
   *
   * `Component` will be rendered after promise is resolved */
  initData?: (view: ViewProps['view']) => unknown | Promise<unknown>
}

export function createDataWidgetSchema<GSchema extends TDataWidgetSchema>(schema: GSchema) {
  return {
    isDataWidget: true,

    name: schema.name as GSchema['name'],

    Component: schema.Component,

    addNodeView() {
      return SvelteNodeViewRenderer(GenericNodeView)
    },

    initData: schema.initData as GSchema['initData'],
  }
}
