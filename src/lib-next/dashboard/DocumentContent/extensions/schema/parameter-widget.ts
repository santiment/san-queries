import { untrack, type Component } from 'svelte'
import type { TDashboardGlobalParameterKey } from '$lib-next/dashboard/types'

import { BROWSER } from 'esm-env'
import { SvelteNodeViewRenderer, type ViewProps } from 'tiptap-svelte-adapter'
import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'
import {
  useDashboardParameterWidgetsCtx,
  type TDashboardParameterWidget,
} from '$lib-next/dashboard/ctx/parameter-widgets.svelte'
import GenericNodeView from '../GenericNodeView.svelte'

export type TParameterWidgetProps<
  GParameterWidget extends TParameterWidgetNode = TParameterWidgetNode,
> = {
  view: ViewProps['view']
  data: {
    id: TDashboardGlobalParameterKey
    widget: TDashboardParameterWidget<GParameterWidget>
  }
}

export type TParameterWidgetComponent = Component<TParameterWidgetProps>
export type TNodeViewInitResult = Partial<TParameterWidgetProps['data']>

type TParameterWidgetSchema = {
  name: string
  keyPrefix: string

  rootTag?: string

  class?: string
  Component: TParameterWidgetComponent

  /** Will be uploaded to API */
  initOutputs(defaultOutputValues?: Partial<{ [key: string]: unknown }>): { [key: string]: unknown }

  /** Will be uploaded to API */
  initSettings?: (defaultSettings?: Partial<{ [key: string]: unknown }>) => {
    [key: string]: unknown
  }

  initNodeView?: (view: ViewProps['view']) => TNodeViewInitResult | Promise<TNodeViewInitResult>
}

// export type TGlobalParameterNode = ReturnType<typeof createGlobalParameterSchema>
export type TParameterWidgetNode<GSchema extends TParameterWidgetSchema = any> = {
  isGlobalParameter: true

  name: GSchema['name']
  keyPrefix: GSchema['keyPrefix']

  class?: GSchema['class']
  Component: TParameterWidgetComponent

  initOutputs: GSchema['initOutputs']
  initSettings: GSchema['initSettings']

  initNodeView: (view: ViewProps['view']) => TNodeViewInitResult | Promise<TNodeViewInitResult>

  addNodeView: () => ReturnType<typeof SvelteNodeViewRenderer>
  renderHTML(this: any, props: { HTMLAttributes: any }): any
}

export function createParameterWidgetSchema<GSchema extends TParameterWidgetSchema>(
  schema: GSchema,
): TParameterWidgetNode<GSchema> {
  const node = {
    isGlobalParameter: true,

    name: schema.name as GSchema['name'],
    keyPrefix: schema.keyPrefix as GSchema['keyPrefix'],

    class: schema.class as GSchema['class'],
    Component: schema.Component,

    initOutputs: schema.initOutputs as GSchema['initOutputs'],
    initSettings: schema.initSettings as GSchema['initSettings'],

    initNodeView(view: ViewProps['view']): TNodeViewInitResult | Promise<TNodeViewInitResult> {
      const { editor, node: viewNode } = view.$
      const { 'data-id': id } = viewNode.attrs

      const { getParameterWidget, registerParameterWidget } = useDashboardParameterWidgetsCtx.get()

      const data: TNodeViewInitResult = { id, widget: getParameterWidget(id) }

      if (!BROWSER || !editor.isEditable || !editor.isInitialized) {
        return data
      }

      // NOTE: This will enforce the order: 1) destroy -> 2) mount
      return Promise.resolve().then(() => {
        const isNewWidget = untrack(() => !data.widget?.__isDestroyed.$)

        if (isNewWidget) {
          const widget = registerParameterWidget(undefined, node)

          data.id = widget.id
          data.widget = widget
        }

        return schema.initNodeView?.(data as any) || data
      })
    },

    addNodeView() {
      return SvelteNodeViewRenderer(GenericNodeView)
    },

    renderHTML(this: any, { HTMLAttributes }: any) {
      return renderNodeViewUniversalHTML(
        [
          // schema.rootTag || 'div',
          'div', // NOTE: For some reason, Tiptap doesn't parse `span` tag correctly, resulting in absent markup when pasting clipboard content
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
