import type { Component } from 'svelte'
import type { TDataWidgetKey } from '../../../types'

import { BROWSER } from 'esm-env'
import { SvelteNodeViewRenderer, type ViewProps } from 'tiptap-svelte-adapter'
import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'
import GenericNodeView from '../GenericNodeView.svelte'
import {
  useDashboardDataWidgetsFlow,
  type TDashboardDataWidget,
} from '../../../ctx/data-widgets.svelte'

export type TDataWidgetProps<GDataWidget extends TDataWidgetNode = TDataWidgetNode> = {
  view: ViewProps['view']
  data: {
    id: TDataWidgetKey
    widget: TDashboardDataWidget<GDataWidget>
  }
}

export type TDataWidgetComponent = Component<TDataWidgetProps>

export type TDataWidgetNodeViewInitResult = Partial<TDataWidgetProps['data']>

export type TDataWidgetSchema = {
  name: string

  Component: TDataWidgetComponent

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

  Component: TDataWidgetComponent

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

    Component: schema.Component,

    initState: schema.initState as GSchema['initState'],

    initNodeView(
      view: ViewProps['view'],
    ): TDataWidgetNodeViewInitResult | Promise<TDataWidgetNodeViewInitResult> {
      const { attrs } = view.$.node
      const { 'data-id': id } = attrs

      const { getDataWidget } = useDashboardDataWidgetsFlow.get()

      const data: TDataWidgetNodeViewInitResult = { id, widget: getDataWidget(id) }

      if (!BROWSER) {
        return data
      }

      return schema.initNodeView?.(data, this, view) || data
    },

    addNodeView() {
      return SvelteNodeViewRenderer(GenericNodeView)
    },

    renderHTML(this: any, { HTMLAttributes }: any) {
      return renderNodeViewUniversalHTML(
        [
          'div',
          {
            'data-type': this.name,
            'data-id': HTMLAttributes['data-id'],
            class: HTMLAttributes['class'],
            style: HTMLAttributes['style'],
          },
        ],
        this.options,
        GenericNodeView as any,
        node,
      )
    },
  } as const

  return node
}
