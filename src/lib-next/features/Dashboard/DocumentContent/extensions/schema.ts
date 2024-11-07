import type { Component } from 'svelte'
import { SvelteNodeViewRenderer, type ViewProps } from 'tiptap-svelte-adapter'
import GenericNodeView from './GenericNodeView.svelte'
import { useDashboardDataWidgetsFlow } from '../../ctx/data-widgets.svelte'
import type { TDataWidgetKey } from '../../types'
import { BROWSER } from 'esm-env'
import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'

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

export type TDataWidgetProps<GDataWidget extends TDataWidgetNode = TDataWidgetNode> = {
  view: ViewProps['view']
  data: {
    id: TDataWidgetKey
    dataWidget: GDataWidget
  }
}

export type AsyncDataWidgetComponent = Promise<{
  default: Component<TDataWidgetProps>
}>

type TDataWidgetNodeViewInitResult = Partial<TDataWidgetProps['data']>

export type TDataWidgetSchema = {
  name: string

  importComponent: () => AsyncDataWidgetComponent

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
  initNodeView?: (
    data: TDataWidgetNodeViewInitResult,
    schema: TDataWidgetNode,
    view: ViewProps['view'],
  ) => TDataWidgetNodeViewInitResult | Promise<TDataWidgetNodeViewInitResult>
}

export type TDataWidgetNode<GSchema extends TDataWidgetSchema = any> = {
  isDataWidget: true
  name: GSchema['name']

  asyncCompnent: Promise<Component<TDataWidgetProps>>

  addNodeView: () => ReturnType<typeof SvelteNodeViewRenderer>
  renderHTML(this: any, props: { HTMLAttributes: any }): any

  initState: GSchema['initState']

  initNodeView: (
    view: ViewProps['view'],
  ) => TDataWidgetNodeViewInitResult | Promise<TDataWidgetNodeViewInitResult>
}

export function createDataWidgetSchema<GSchema extends TDataWidgetSchema>(
  schema: GSchema,
): TDataWidgetNode<GSchema> {
  const node = {
    isDataWidget: true,

    name: schema.name as GSchema['name'],

    asyncCompnent: schema.importComponent().then((mod) => mod.default),

    addNodeView() {
      return SvelteNodeViewRenderer(GenericNodeView)
    },

    renderHTML(this: any, { HTMLAttributes }: any) {
      return renderNodeViewUniversalHTML(
        ['div', { 'data-type': this.name, 'data-id': HTMLAttributes['data-id'] }],
        this.options,
        GenericNodeView as any,
        node,
      )
    },

    initState: schema.initState as GSchema['initState'],

    async initNodeView(view: ViewProps['view']): Promise<TDataWidgetNodeViewInitResult> {
      const { attrs } = view.$.node
      const { 'data-id': id } = attrs

      const { getDataWidget } = useDashboardDataWidgetsFlow.get()

      const data = { id, dataWidget: getDataWidget(id) } as TDataWidgetNodeViewInitResult

      if (!BROWSER) {
        return data
      }

      return schema.initNodeView?.(data, this, view) || data
    },
  } as const

  return node
}
