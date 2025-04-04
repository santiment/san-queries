import type { Component } from 'svelte'
import type { TApiDataWidget, TDataWidgetKey } from '../../../types'

import { BROWSER } from 'esm-env'
import { SvelteNodeViewRenderer, type ViewProps } from 'tiptap-svelte-adapter'

import GenericNodeView from '../GenericNodeView.svelte'
import { renderNodeViewUniversalHTML } from '../../SSR'
import {
  useDashboardDataWidgets,
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

  class?: string

  Component: TDataWidgetComponent

  /** Will be uploaded to API */
  initSettings?: (defaultSettings?: Partial<{ [key: string]: unknown }>) => {
    [key: string]: unknown
  }

  /** Will NOT be uploaded to API */
  initState(defaultSettings?: Partial<{ [key: string]: unknown }>): { [key: string]: unknown }

  /** Will NOT be uploaded to API */
  initData?: (id: TDataWidgetKey, allCtxs: Map<string, any>) => any

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

  create(
    this: TDataWidgetSchema,
    data: { id?: TDataWidgetKey },
    view: ViewProps['view'],
  ): TApiDataWidget | Promise<TApiDataWidget>
}

export type TDataWidgetNode<GSchema extends TDataWidgetSchema = any> = {
  isDataWidget: true

  name: GSchema['name']

  class?: GSchema['class']

  Component: TDataWidgetComponent

  addNodeView: () => ReturnType<typeof SvelteNodeViewRenderer>
  renderHTML(this: any, props: { HTMLAttributes: any }): any

  initState: GSchema['initState']
  initSettings: GSchema['initSettings']
  initData: GSchema['initData']

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
    class: schema.class as GSchema['class'],

    Component: schema.Component,

    initState: schema.initState as GSchema['initState'],

    initSettings: schema.initSettings as GSchema['initSettings'],

    initData: schema.initData as GSchema['initData'],

    initNodeView(
      view: ViewProps['view'],
    ): TDataWidgetNodeViewInitResult | Promise<TDataWidgetNodeViewInitResult> {
      const { editor, node: viewNode } = view.$
      const { 'data-id': id } = viewNode.attrs

      const { getDataWidget, createDashboardDataWidget } = useDashboardDataWidgets.get()

      const data: TDataWidgetNodeViewInitResult = { id, widget: getDataWidget(id) }

      if (!BROWSER || !editor.isEditable || !editor.isInitialized) {
        return data
      }

      // NOTE: This will enforce the order: 1) destroy -> 2) mount after global params
      return Promise.resolve()
        .then(() => Promise.resolve())
        .then(() => {
          if (data.widget) return data

          const widget = createDashboardDataWidget(schema.create({ id: data.id }, view), this)
          data.id = widget.id
          data.widget = widget

          return data

          // return schema.create(data, this, view)
        })
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
